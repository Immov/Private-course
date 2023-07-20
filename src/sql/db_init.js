const query = require("./queries");

// COMMAND: node .\src\sql\db_init.js

function create_all_tables() {
	query.create_user_account_table();
	query.create_admin_account_table();
	query.create_teacher_account_table();
	query.create_teacher_levels_table();
	query.create_student_account_table();
	query.create_course_table();
	query.create_student_enrollment_table();
	query.create_course_session();
	query.create_course_lecturer_table();
}

function drop_all() {
	let tables = [
		"course_lecturer",
		"course_session",
		"student_enrollment",
		"course",
		"student_account",
		"teacher_levels",
		"teacher_account",
		"admin_account",
		"user_account",
	];

	query.dropTables(tables);
}

create_all_tables();
// drop_all();
// query.showTables();

// query.insertCourses();
// query.insertUsers();
// query.insertStudents();
// query.insertTeachers();
// query.insertStudentEnrollments();
// query.insertCourseSessions();
