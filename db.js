const dotenv = require('dotenv');
const mysql = require('mysql2');
dotenv.config()
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

async function getEmail(email) {
    const [isemail] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return isemail
}
var users = 5;
async function signupUser(email, password) {
    student_id = users;
    const [user] = await pool.query('INSERT INTO users SET ?', {student_id: student_id, email: email, password: password});
    users += 1;
    return users
}

async function getCourses() {
    const [rows] = await pool.query("SELECT * FROM all_courses");
        return rows
}

async function myDrops(student_id) {
    const rows = await pool.query(`SELECT * FROM drop_courses WHERE student_id = ?`, [student_id]);
    return rows
}

async function dropCourse(student_id, year, course_name, faculty, slot) {
    const [result] = await pool.query(
        `INSERT INTO drop_courses (student_id, year, course_name, faculty, slot)
        VALUES (?, ?, ?, ?, ?)`,
        [student_id, year, course_name, faculty, slot]
    )
    return myDrops(student_id)
}

module.exports = {
    getCourses,
    dropCourse,
    myDrops,
    getEmail,
    signupUser
  };