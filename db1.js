var mysql = require('mysql2');

var db_config ={
    host: 'localhost',
    user: 'aperun_user',
    password: 'vishaL@59t',
    port: 5500,
    database: 'aperunDB',
    waitForConnections: true
}

var connection;

function handleDisconnect() {
    console.log('call handleDisconnect 1');
    connection =  mysql.createPool(db_config);

    connection.getConnection(function (err,con){
        console.log('errr::',err);
        console.log('conn::',con);
    })

    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
            console.log('call handleDisconnect 3');
        } else {
            throw err;
        }
    });

}

handleDisconnect();

module.exports = connection;
