const faker = require("faker");

function createMockupData() {
	// Create user accounts
	for (let i = 0; i < 10; i++) {
		let fullName = faker.name.findName();
		let email = faker.internet.email();
		let username = faker.internet.userName();
		let password = faker.internet.password();
		let phoneNumber = faker.phone.phoneNumber();

		let userQuery = `INSERT INTO user_account (full_name, email, username, password, phone_number) VALUES ('${fullName}', '${email}', '${username}', '${password}', '${phoneNumber}');`;

		executeQuery(userQuery, (result) => {
			let userId = result.insertId;

			// Create teacher account
			if (i < 5) {
				let about = faker.lorem.paragraph();

				let teacherQuery = `INSERT INTO teacher_account (user_id, about) VALUES (${userId}, '${about}');`;

				executeQuery(teacherQuery);
			}

			// Create student account
			if (i >= 5) {
				let level = faker.random.arrayElement([
					"Beginner",
					"Intermediate",
					"Advanced",
				]);

				let studentQuery = `INSERT INTO student_account (user_id, level) VALUES (${userId}, '${level}');`;

				executeQuery(studentQuery);
			}
		});
	}

	// Create courses
	let courses = [
		{
			name: "Mathematics",
			description: "Learn math concepts and solve problems.",
			level: "Intermediate",
		},
		{
			name: "English Literature",
			description:
				"Explore classic literature works and improve language skills.",
			level: "Advanced",
		},
		{
			name: "Computer Science",
			description: "Learn programming and computer fundamentals.",
			level: "Beginner",
		},
	];

	courses.forEach((course) => {
		let courseQuery = `INSERT INTO course (course_name, course_description, course_level) VALUES ('${course.name}', '${course.description}', '${course.level}');`;

		executeQuery(courseQuery, (result) => {
			let courseId = result.insertId;

			// Enroll students in courses
			for (let i = 0; i < 3; i++) {
				let studentId = faker.random.number({ min: 6, max: 15 });

				let enrollmentQuery = `INSERT INTO student_enrollment (student_id, course_id) VALUES (${studentId}, ${courseId});`;

				executeQuery(enrollmentQuery);
			}

			// Assign teachers to courses
			if (course.level === "Intermediate") {
				let teacherId = faker.random.number({ min: 1, max: 5 });
				let fee = faker.random.number({ min: 100, max: 500 });

				let lecturerQuery = `INSERT INTO course_lecturer (teacher_id, course_id, fee) VALUES (${teacherId}, ${courseId}, ${fee});`;

				executeQuery(lecturerQuery);
			}
		});
	});
}

module.exports = {
	createMockupData,
};
