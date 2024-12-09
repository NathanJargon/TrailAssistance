CREATE TABLE Students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    student_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Degree_Students (
    student_id INT PRIMARY KEY REFERENCES Students(student_id),
    program VARCHAR(50) NOT NULL,
    year_of_study INT NOT NULL,
    major VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Graduate_Students (
    student_id INT PRIMARY KEY REFERENCES Students(student_id),
    program VARCHAR(50) NOT NULL,
    field_of_study VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    advisor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Alumni (
    alumni_id INT PRIMARY KEY REFERENCES Students(student_id),
    graduation_year INT NOT NULL,
    degree VARCHAR(50) NOT NULL,
    current_employer VARCHAR(255),
    job_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Exchange_Visiting_Students (
    student_id INT PRIMARY KEY REFERENCES Students(student_id),
    home_institution VARCHAR(255) NOT NULL,
    program_duration VARCHAR(50) NOT NULL,
    advisor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Non_Degree_Students (
    student_id INT PRIMARY KEY REFERENCES Students(student_id),
    reason_for_enrollment VARCHAR(255) NOT NULL,
    program_duration VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Prospective_Students (
    prospective_id INT PRIMARY KEY REFERENCES Students(student_id),
    interest_field VARCHAR(100) NOT NULL,
    intended_program VARCHAR(100) NOT NULL,
    inquiry_date TIMESTAMP NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Student_Staff (
    student_staff_id INT PRIMARY KEY REFERENCES Students(student_id),
    job_title VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    employment_start_date DATE NOT NULL,
    employment_end_date DATE,
    employment_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Visit_Requests (
    visit_request_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES Students(student_id),
    type_of_visit VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    time_of_entry TIMESTAMP NOT NULL,
    time_of_exit TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Admin (
    admin_id INT PRIMARY KEY REFERENCES Students(student_id),
    department VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);