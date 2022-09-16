const { validationResult } = require("express-validator");
var connection = require("../db").promise();

exports.updateTotalCoin = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var coin = req?.body?.coin;
  const token = req?.headers?.authorization?.split(" ")[1];
  
  try {
    if (token) {
      const [row] = await connection.execute(
        "SELECT * FROM users cross join loginUser on loginUser.userID = users.id cross join leaderboard on leaderboard.userID = users.id WHERE loginUser.usertoken=? ",
        [token]
      );

        let totalCoin = Number(coin) + row[0].coin;


      if (row.length > 0) {
        const [rows] = await connection.execute(
          "UPDATE `leaderboard` SET coin=?,updated_date=?  WHERE `userID`=?",
          [totalCoin, new Date(), row[0]?.userID]
        );

        if (rows.affectedRows === 1) {
          return res.json({ success: true, message: "successfully updated !" });
        }
      } else {
        return res.json({ success: false, message: "Unauthorized accress !" });
      }
    } else {
      return res.json({ success: false, message: "auth Token not found" });
    }
  } catch (error) {
    console.log(" error:::", error);
  }
  return res.status(201).json({ success: false, message: "Error" });
};

exports.updateCreditLife = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var credit = req.body.creditlife;
  const token = req?.headers?.authorization?.split(" ")[1];

  try {
    if (token) {
      const [row] = await connection.execute(
        "SELECT * FROM users cross join loginUser on loginUser.userID = users.id cross join leaderboard on leaderboard.userID = users.id WHERE loginUser.usertoken=? ",
        [token]
      );

      if (row.length > 0) {
        const [rows] = await connection.execute(
          "UPDATE `leaderboard` SET creditlife=?,updated_date=?  WHERE `userID`=?",
          [Number(credit) + row[0].creditlife, new Date(), row[0]?.userID]
        );
        if (rows.affectedRows === 1) {
          return res.json({ success: true, message: "successfully updated !" });
        }
      } else {
        return res.json({ success: false, message: "Unauthorized accress !" });
      }
    } else {
      return res.json({ success: false, message: "auth Token not found" });
    }
  } catch (error) {

    return res.json({ success: false, message: error });
  }
  return res.json({ success: false, message: "Error" });
};

exports.getScoreAll = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const token = req?.headers?.authorization?.split(" ")[1];

  if (token) {
    try {
      const [row] = await connection.execute(
        "SELECT users.id,users.yourname, leaderboard.coin,leaderboard.creditlife  FROM users cross join loginUser on loginUser.userID = users.id cross join leaderboard on leaderboard.userID = users.id"
      );
      // `select u.yourname "users", b.coin "leaderboard" from users u, leaderboard b, loginUser l where b.userID = u.id and b.userID = l.userID and l.usertoken=?`

      if (row.length > 0) {
        return res.json({ success: true, coinInfo: row });
      }
    } catch (error) {
      console.log("error", error);

      return res.json({ success: false, message: error });
    }
  } else {
    return res.json({
      success: false,
      message: "auth Token not found",
      token: token,
    });
  }
};

exports.getScorebyId = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const token = req?.headers?.authorization?.split(" ")[1];
  const usewrID = req?.params?.userID;

  if (token) {
    try {
      const [row] = await connection.execute(
        "SELECT users.id,users.yourname, leaderboard.coin,leaderboard.creditlife  FROM users cross join loginUser on loginUser.userID = users.id cross join leaderboard on leaderboard.userID = users.id  WHERE users.id=?",
        [usewrID]
      );

      if (row.length > 0) {
        return res.json({ success: true, coinInfo: row });
      } else {
        return res.json({
          success: false,
          message: "Data not found !",
        });
      }
    } catch (error) {
      console.log("error", error);

      return res.json({ success: false, message: error });
    }
  } else {
    return res.json({
      success: false,
      message: "auth Token not found",
      token: token,
    });
  }
};

exports.withdrawCoin = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  var amount = req.body.coinAmount;
  const token = req?.headers?.authorization?.split(" ")[1];

  if (token) {
    try {
      const [row] = await connection.execute(
        "SELECT * FROM users cross join loginUser on loginUser.userID = users.id cross join leaderboard on leaderboard.userID = users.id WHERE loginUser.usertoken=? ",
        [token]
      );

      if (row.length > 0) {
        if (row[0].coin >= amount) {
          const [col] = await connection.execute(
            "INSERT INTO `withdrawhistory`(`userID`,`email`,`walletaddress`,`amount`,`created_date`) VALUES(?,?,?,?,?)",
            [
              row[0]?.userID,
              row[0]?.email,
              row[0]?.walletaddress,
              amount,
              new Date(),
            ]
          );
          if (col.affectedRows === 1) {
            const [rows] = await connection.execute(
              "UPDATE leaderboard SET coin=?  WHERE userID=? ",
              [row[0].coin - amount, row[0]?.userID]
            );
            if (rows.affectedRows === 1) {
              const [cols] = await connection.execute(
                "SELECT * FROM users cross join leaderboard on leaderboard.userID = users.id WHERE users.id=? ",
                [row[0]?.userID]
              );
              return res.json({
                success: true,
                message: "successfully withdraw Coin !",
                data: cols[0],
              });
            }
          } else {
            return res.json({ success: false, message: "Some Error Please try again !", });
          }
        } else {
          return res.json({ success: false, message: "insufficient amount !" });
        }
      } else {
        return res.json({ success: false, message: "Unauthorized accress !" });
      }
    } catch (error) {
      return res.json({ success: false, error });
    }
  } else {
    return res.json({ success: false, message: "Unauthorized accress !" });
  }
};
