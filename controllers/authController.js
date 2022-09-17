require('dotenv').config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const connection = require("../db").promise();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

exports.register = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const [row] = await connection.execute(
      "SELECT email FROM loginUser WHERE `email`=?",
      [req.body.email]
    );

    if (row.length > 0) {
      return res.json({
        success: false,
        message: "The E-mail already in use",
      });
    }

    const hashPass = await bcrypt.hash(req.body.password, 12);
    const [rows] = await connection.execute(
      "INSERT INTO users(`yourname`,`email`,`walletaddress`,`created_date`,`updated_date`) VALUES(?,?,?,?,?)",
      [req?.body?.yourname, req?.body?.email, req?.body?.walletaddress, new Date(), new Date()]
    );

    if (rows.affectedRows === 1) {
      const [col] = await connection.execute(
        "SELECT * FROM users WHERE email=?",
        [req?.body?.email]
      );

      if (col.length > 0) {
        const [row] = await connection.execute(
          "INSERT INTO loginUser(`userID`,`email`,`password`) VALUES(?,?,?)",
          [col[0]?.id, req?.body?.email, hashPass]
        );

        const [val] = await connection.execute(
          "INSERT INTO leaderboard(`userID`,`coin`,`creditlife`,`created_date`,`updated_date`) VALUES(?,?,?,?,?)",
          [col[0]?.id, 0, 0, new Date(), new Date()]
        );

        if (row.affectedRows === 1 && val.affectedRows === 1) {
          return res.json({
            success: true,
            message: "The user has been successfully inserted.",
            user: col[0],
          });
        }
      }
    } else {
      return res.json({ success: false, message: "error !" });
    }
  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const [row] = await connection.execute(
      "SELECT * FROM loginUser WHERE email=?",
      [req.body.email]
    );

    const [col] = await connection.execute(
      "select * from users  JOIN leaderboard on users.id = leaderboard.userID WHERE users.email=?",
      [req.body.email]
    );

    if (row.length === 0 && col.length === 0) {
      return res.json({
        success: false,
        message: "Invalid email address",
      });
    }

    const passMatch = await bcrypt.compare(req.body.password, row[0].password);
    if (!passMatch) {
      return res.json({
        success: false,
        message: "Incorrect password",
      });
    }

    const theToken = jwt.sign({ id: row[0].userID }, "the-super-strong-secrect", {expiresIn: "10d"});

    if (theToken) {
      const [rows] = await connection.execute(
        "UPDATE loginUser SET usertoken=?  WHERE email=?",
        [theToken, req.body.email]
      );
      return res.json({
        success: true,
        message: "Logged in successfully 😊",
        token: theToken,
        user: col[0],
      });
    } else {
      return res.json({
        success: false,
        message: "jwtToken not generate Please login again !",
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.forgotEmail = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var email = req.body.email;

  try {
    const [row] = await connection.execute(
      "SELECT * FROM loginUser WHERE email=?",
      [email]
    );

    if (row.length > 0) {
      var token = row[0].usertoken;

      const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      const [val] = await connection.execute(
        "UPDATE loginUser SET otp=?  WHERE email=?",
        [OTP, email]
      );

      await sendEmail(email, token, OTP);

      return res.json({
        status: 200,
        success: true,
        message: "Please check your email for a new password",
      });
    }
  } catch (err) {
    console.log("err ::-", err);
    next(err);
  }

  return res.json({ success: false, message: req.body?.email + " is not found !" });
};

exports.verifyEmail = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const otp = req?.body?.otp;

  try {
    const [row] = await connection.execute(
      "SELECT * FROM loginUser WHERE otp=?",
      [otp]
    );
    if (row.length > 0) {
      const [rows] = await connection.execute(
        "UPDATE loginUser SET otp=?  WHERE otp=?",
        [null, otp]
      );
      return res.json({ success: true, status: 200, message: "your otp is verify !" });
    } else {
      return res.json({ success: false, message: "error!" });
    }
  } catch (error) {
    console.log("error :::", error);

    return res.json({ success: false,error });
  }
};

exports.forgotpassword = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var email = req.body.email;

  const hashPass = await bcrypt.hash(req.body.password, 12);
  try {
    const [row] = await connection.execute(
      "SELECT * FROM loginUser WHERE email=?",
      [email]
    );

    if (row.length > 0) {
      const [rows] = await connection.execute(
        "UPDATE loginUser SET password=?  WHERE email=?",
        [hashPass, email]
      );

      if (rows.affectedRows === 1) {

        return res.json({
          success: true,
          message:
            "Password reset successful, you can now login with the new password",
        });
      } else {
        return res.json({ success: false, message: "Password not forgot !" });
      }

    } else {
      return res.json({ success: false, message: "email address not found !" });
    }
  } catch (error) {
    next(err);
  }
};

exports.changepassword = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const token = req?.headers?.authorization?.split(" ")[1];

  const [row] = await connection.execute(
    "SELECT * FROM loginUser WHERE usertoken=?",
    [token]
  );

  if (row.length > 0) {
    const passMatch = await bcrypt.compare( req?.body?.oldpassword, row[0]?.password);

    const hashNewPass = await bcrypt.hash(req?.body?.newpassword, 12);

    if (!passMatch) {
      return res.json({ success: false, message: "Incorrect old password" });
    } else {
      const [val] = await connection.execute(
        "UPDATE loginUser SET password=?  WHERE usertoken=?",
        [hashNewPass, token]
      );
      return res.json({
        status: 200,
        success: true,
        message: "New password has been succesfully updated !",
      });
    }
  } else {
    return res.json({ success: false, message: "auth Token is not true" });
  }
};

async function sendEmail(email, token, otp) {
  var email = email;
  var token = token;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password Link - aperun.com",
    text: "That was easy!",
    html: ` <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
              <h2>Welcome to the APE RUN .</h2>
              <p style="margin-bottom: 30px;">Pleas enter the  OTP to get started</p>
              <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
            </div>
          `,
  };

  transporter.verify(async function (error, success) {
    if (error) {
      console.log("::::----------------", error);
    } else {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("error :;", error);
        } else {
          console.log("info :::", info);
        }
      });
    }
  });
}

exports.changeWalletAddress = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const token = req?.headers?.authorization?.split(" ")[1];
  const address = req?.body?.walletaddress;
  const [row] = await connection.execute(
    "SELECT * FROM loginUser cross join users on loginUser.userID = users.id  WHERE loginUser.usertoken=?",
    [token]
  );

  if (row.length > 0) {
    const [rows] = await connection.execute(
      "UPDATE users SET walletaddress=?  WHERE id=? ",
      [address, row[0]?.userID]
    );

    if (rows.affectedRows === 1) {
      return res.json({
        success: true,
        message: 'Wallet Address successfully Updated !'
      })
    } else {
      return res.json({
        success: false,
        message: 'Wallet Address not Updated !'
      })
    }

  } else {
    return res.json({ success: false, message: "Unauthorized accress !" });
  }
}


exports.getUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const token = req?.headers?.authorization?.split(" ")[1];
  try {
    const [row] =
      await connection.execute(
        'select * from loginuser cross join users on loginuser.userID = users.id cross join leaderboard on leaderboard.userID = users.id cross join withdrawhistory on withdrawhistory.userID = users.id   where loginuser.usertoken=?',
        [token])

    if (row.length > 0) {
      return res.json({ data: row[0], success: true })
    } else {
      return res.json({ success: false, message: "Unauthorized accress !" });
    }

  } catch (error) {
    return res.json({ success: false, error })
  }
}

exports.getAllUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const [row] =
      await connection.execute(
        'select * from loginuser cross join users on loginuser.userID = users.id cross join leaderboard on leaderboard.userID = users.id ')

    if (row.length > 0) {
      return res.json({ data: row, success: true })
    } else {
      return res.json({ success: false, message: "Unauthorized accress !" });
    }

  } catch (error) {
    return res.json({ success: false, error })
  }
}