const mysql= require("mysql2");
const util= require("util");

const conn = mysql.createConnection({
    host:"bcitcy8hlnvubbnzrrek-mysql.services.clever-cloud.com",
    user:"ubwtwgnyoed2msr8",
    password:"Uh14hX77E79QB2fWxHzh",
    database:"bcitcy8hlnvubbnzrrek"
});


const exe = util.promisify(conn.query).bind(conn);

module.exports = exe;