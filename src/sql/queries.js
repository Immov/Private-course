const { resolveInclude } = require("ejs");
const mysql = require("mysql");
require("dotenv").config();

const sql_host = process.env.SQL_HOST;
const sql_username = process.env.SQL_USERNAME;
const sql_password = process.env.SQL_PASSWORD;
const sql_database = process.env.SQL_DATABASE;

var con = mysql.createConnection({
	host: sql_host,
	user: sql_username,
	password: sql_password,
	database: sql_database,
});

function executeQuery(query, callback) {
	con.query(query, (err, res) => {
		if (err) throw err;
		console.log("Result: ", res);
		if (callback) callback(res);
	});
}

function insertQuery(table, columns, values, callback) {
	let query = `INSERT INTO ${table} ${columns} VALUES ?`;
	con.query(query, [values], function (err, res) {
		if (err) throw err;
		if (callback) callback(res);
	});
}

function selectQuery(table, columns, condition, callback) {
	let query = `SELECT ${columns} FROM ${table} WHERE ${condition}`;
	con.query(query, function (err, res) {
		if (err) throw err;
		callback(res);
	});
}

function updateQuery(table, columnsAndValues, condition, callback) {
	let query = `UPDATE ${table} SET ${columnsAndValues} WHERE ${condition}`;
	con.query(query, function (err, res) {
		if (err) throw err;
		if (callback) callback(res);
	});
}

function deleteQUery(table, condition, callback) {
	let query = `DELETE FROM ${table} WHERE ${condition}`;
	con.query(query, function (err, res) {
		if (err) throw err;
		if (callback) callback(res);
	});
}

function create_user_account_table() {
	let query = `
	CREATE TABLE IF NOT EXISTS user_account (
		user_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
		full_name VARCHAR(100) NOT NULL,
		email VARCHAR(255) NOT NULL UNIQUE,
		username VARCHAR(50) NOT NULL,
		password VARCHAR(255) NOT NULL,
		phone_number VARCHAR(20) NOT NULL,
		role VARCHAR(20) DEFAULT NULL,
		profile_picture varchar(100) DEFAULT NULL
	);`;
	executeQuery(query);
}

function create_admin_account_table() {
	let query = `
	CREATE TABLE IF NOT EXISTS admin_account (
		admin_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
		full_name VARCHAR(100) NOT NULL,
		email VARCHAR(255) NOT NULL,
		username VARCHAR(50) NOT NULL,
		password VARCHAR(255) NOT NULL,
		phone_number VARCHAR(20) NOT NULL
	);`;
	executeQuery(query);
}

function create_teacher_account_table() {
	let query = `
	CREATE TABLE IF NOT EXISTS teacher_account (
		teacher_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
		user_id INT NOT NULL,
		about TEXT DEFAULT NULL,
		FOREIGN KEY (user_id) REFERENCES user_account(user_id)
	);`;
	executeQuery(query);
}

function create_teacher_levels_table() {
	let query = `
	CREATE TABLE IF NOT EXISTS teacher_levels (
		teacher_levels_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
		teacher_id INT NOT NULL,
		level VARCHAR(30) NOT NULL,
		FOREIGN KEY (teacher_id) REFERENCES teacher_account(teacher_id)
	);`;
	executeQuery(query);
}

function create_student_account_table() {
	let query = `
	CREATE TABLE IF NOT EXISTS student_account (
		student_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
		user_id INT NOT NULL,
		level VARCHAR(30) DEFAULT NULL,
		FOREIGN KEY (user_id) REFERENCES user_account(user_id)
	);`;
	executeQuery(query);
}

function create_course_table() {
	let query = `
	CREATE TABLE IF NOT EXISTS course (
		course_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
		course_name VARCHAR(50),
		course_description TEXT,
		course_level VARCHAR(30)
	);`;
	executeQuery(query);
}

function create_student_enrollment_table() {
	let query = `
	CREATE TABLE IF NOT EXISTS student_enrollment (
		enrollment_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
		student_id INT NOT NULL,
		course_id INT NOT NULL,
		FOREIGN KEY (student_id) REFERENCES student_account(student_id),
		FOREIGN KEY (course_id) REFERENCES course(course_id)
	);`;
	executeQuery(query);
}

function create_course_session() {
	let query = `
	CREATE TABLE IF NOT EXISTS course_session (
		session_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
		teacher_id INT NOT NULL,
		student_id INT NOT NULL,
		course_id INT NOT NULL,
		session_schedule DATETIME,
		session_status VARCHAR(20),
		FOREIGN KEY (teacher_id) REFERENCES teacher_account(teacher_id),
		FOREIGN KEY (student_id) REFERENCES student_account(student_id),
		FOREIGN KEY (course_id) REFERENCES course(course_id)
	);`;
	executeQuery(query);
}

function create_course_lecturer_table() {
	let query = `
	CREATE TABLE IF NOT EXISTS course_lecturer (
		lecturer_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
		teacher_id INT,
		course_id INT,
		fee INT,
		FOREIGN KEY (teacher_id) REFERENCES teacher_account(teacher_id),
		FOREIGN KEY (course_id) REFERENCES course(course_id)
	);`;
	executeQuery(query);
}

function showTables() {
	let query = `SHOW TABLES;`;
	executeQuery(query);
}

// Drop tables
function dropTables(tables) {
	// Check if tables array is empty
	if (tables.length === 0) {
		console.log("No tables specified to drop.");
		return;
	}

	// Iterate over the tables array and drop each table
	tables.forEach((table) => {
		let query = `DROP TABLE IF EXISTS ${table};`;
		executeQuery(query);
	});
}

// Insert Mockup datas =========================

module.exports = {
	create_user_account_table,
	create_admin_account_table,
	create_teacher_account_table,
	create_teacher_levels_table,
	create_student_account_table,
	create_course_table,
	create_student_enrollment_table,
	create_course_session,
	create_course_lecturer_table,
	showTables,
	dropTables,
	executeQuery,
	insertQuery,
	selectQuery,
	updateQuery,
	deleteQUery,
};
