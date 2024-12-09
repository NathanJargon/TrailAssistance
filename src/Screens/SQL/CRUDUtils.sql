-- Students Table CRUD Operations

INSERT INTO Students (name, email, password_hash, student_type)
VALUES ('John Doe', 'john.doe@example.com', 'hashedpassword', 'undergraduate');

SELECT * FROM Students;

SELECT * FROM Students
WHERE student_id = 1;

UPDATE Students
SET name = 'Jane Doe'
WHERE student_id = 1;

DELETE FROM Students
WHERE student_id = 1;

-- Degree_Students Table CRUD Operations

INSERT INTO Degree_Students (student_id, program, year_of_study, major, status)
VALUES (1, 'B.Sc.', 2, 'Computer Science', 'enrolled');

SELECT * FROM Degree_Students;

SELECT * FROM Degree_Students
WHERE student_id = 1;

UPDATE Degree_Students
SET program = 'B.A.'
WHERE student_id = 1;

DELETE FROM Degree_Students
WHERE student_id = 1;

-- Graduate_Students Table CRUD Operations

INSERT INTO Graduate_Students (student_id, program, field_of_study, status, advisor)
VALUES (2, 'M.Sc.', 'Physics', 'enrolled', 'Dr. Smith');

SELECT * FROM Graduate_Students;

SELECT * FROM Graduate_Students
WHERE student_id = 2;

UPDATE Graduate_Students
SET advisor = 'Dr. Johnson'
WHERE student_id = 2;

DELETE FROM Graduate_Students
WHERE student_id = 2;

-- Alumni Table CRUD Operations

INSERT INTO Alumni (alumni_id, graduation_year, degree, current_employer, job_title)
VALUES (3, 2020, 'B.A.', 'Tech Corp', 'Software Engineer');

SELECT * FROM Alumni;

SELECT * FROM Alumni
WHERE alumni_id = 3;

UPDATE Alumni
SET current_employer = 'New Tech Corp'
WHERE alumni_id = 3;

DELETE FROM Alumni
WHERE alumni_id = 3;

-- Exchange_Visiting_Students Table CRUD Operations

INSERT INTO Exchange_Visiting_Students (student_id, home_institution, program_duration, advisor)
VALUES (4, 'University of XYZ', 'one semester', 'Prof. Adams');

SELECT * FROM Exchange_Visiting_Students;

SELECT * FROM Exchange_Visiting_Students
WHERE student_id = 4;

UPDATE Exchange_Visiting_Students
SET home_institution = 'University of ABC'
WHERE student_id = 4;

DELETE FROM Exchange_Visiting_Students
WHERE student_id = 4;

-- Non_Degree_Students Table CRUD Operations

INSERT INTO Non_Degree_Students (student_id, reason_for_enrollment, program_duration)
VALUES (5, 'Professional Development', 'six months');

SELECT * FROM Non_Degree_Students;

SELECT * FROM Non_Degree_Students
WHERE student_id = 5;

UPDATE Non_Degree_Students
SET reason_for_enrollment = 'Personal Interest'
WHERE student_id = 5;

DELETE FROM Non_Degree_Students
WHERE student_id = 5;

-- Prospective_Students Table CRUD Operations

INSERT INTO Prospective_Students (prospective_id, interest_field, intended_program, inquiry_date, notes)
VALUES (6, 'Engineering', 'B.Eng.', '2024-01-01', 'Interested in robotics');

SELECT * FROM Prospective_Students;

SELECT * FROM Prospective_Students
WHERE prospective_id = 6;

UPDATE Prospective_Students
SET intended_program = 'B.Sc.'
WHERE prospective_id = 6;

DELETE FROM Prospective_Students
WHERE prospective_id = 6;

-- Student_Staff Table CRUD Operations

INSERT INTO Student_Staff (student_staff_id, job_title, department, employment_start_date, employment_status)
VALUES (7, 'Teaching Assistant', 'Computer Science', '2023-09-01', 'active');

SELECT * FROM Student_Staff;

SELECT * FROM Student_Staff
WHERE student_staff_id = 7;

UPDATE Student_Staff
SET job_title = 'Research Assistant'
WHERE student_staff_id = 7;

DELETE FROM Student_Staff
WHERE student_staff_id = 7;

-- Visit_Requests Table CRUD Operations

INSERT INTO Visit_Requests (student_id, type_of_visit, details, time_of_entry, status)
VALUES (1, 'consultation', 'Need advice on course selection', '2024-01-01 10:00:00', 'in-progress');

SELECT * FROM Visit_Requests;

SELECT * FROM Visit_Requests
WHERE visit_request_id = 8;

UPDATE Visit_Requests
SET status = 'completed'
WHERE visit_request_id = 8;

DELETE FROM Visit_Requests
WHERE visit_request_id = 8;

-- Admin Table CRUD Operations

INSERT INTO Admin (admin_id, department, role)
VALUES (9, 'Dean\'s Office', 'Dean\'s Office Admin');

SELECT * FROM Admin;

SELECT * FROM Admin
WHERE admin_id = 9;

UPDATE Admin
SET role = 'Financial Aid Admin'
WHERE admin_id = 9;

DELETE FROM Admin
WHERE admin_id = 9;