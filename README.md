# Private Course App

## Must-have Features:

- Database Access (SQL)
- Filter, Pagination
- Validation
- Authentication & Authorization
- Upload File
- PDF Download
- Graph Implementation
- AJAX
- CSR (Client Side Rendering)

## Available methods:

- GET
- POST
- PUT
- DELETE

## System:

Landing page:

- User can sign up as a new user, then they can choose to sign up as a teacher or student -> insert into user_account table.
- If they are a student, they can choose one of three levels (elementary, junior high, senior high) -> insert into student_account table.
- If they choose to be a teacher, they can create a bio to talk about themselves -> insert into teacher_account table.
- If they choose to be a teacher, they can choose one or more levels (elementary, junior high, senior high) -> insert into teacher_levels table.

After logging in:

- Teacher:

  - They can choose one or more existing courses or create a new course that matches their level of interest -> insert into course_lecturer table.
  - They can also create course sessions with the subjects they teach at specific times -> insert into course_session table.

- Student:
  - They can choose one or more courses from the available courses that match their level -> insert into student_enrollment table.
- After choosing a course, students can:
  - See all the courses they have enrolled in.
  - Click on a course to view the available sessions created by the teacher -> update course_session table.
