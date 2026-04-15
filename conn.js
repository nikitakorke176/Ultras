const mysql= require("mysql2");
const util= require("util");

const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"a2z51project"
});


const exe = util.promisify(conn.query).bind(conn);

module.exports = exe;