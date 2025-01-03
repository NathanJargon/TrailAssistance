# Database Schema for Student Management System

## Tables

1. Students Table
Purpose: Store general information applicable to all types of students and users.
Attributes:
student_id (Primary Key)
name
email
password_hash
student_type (e.g., "undergraduate", "graduate", "alumni", "exchange", "non-degree", "prospective")
created_at (timestamp)
updated_at (timestamp)

2. Degree_Students Table
Purpose: Store specific information for students pursuing their first degree.
Attributes:
student_id (Primary Key, Foreign Key referencing student_id in Students)
program (e.g., B.A., B.Sc.)
year_of_study (e.g., 1, 2, 3, 4)
major
status (e.g., "enrolled," "leave of absence")
created_at
updated_at

3. Graduate_Students Table
Purpose: Store specific information for students in advanced degree programs.
Attributes:
student_id (Primary Key, Foreign Key referencing student_id in Students)
program (e.g., M.A., Ph.D.)
field_of_study
status (e.g., "enrolled," "research phase")
advisor (name of advisor/professor)
created_at
updated_at

4. Alumni Table
Purpose: Store specific information about former students.
Attributes:
alumni_id (Primary Key, Foreign Key referencing student_id in Students)
graduation_year
degree (e.g., B.A., M.Sc.)
current_employer
job_title
created_at
updated_at

5. Exchange_Visiting_Students Table
Purpose: Store details about exchange or visiting students.
Attributes:
student_id (Primary Key, Foreign Key referencing student_id in Students)
home_institution
program_duration (e.g., "one semester," "one year")
advisor (institutional advisor)
created_at
updated_at

6. Non_Degree_Students Table
Purpose: Store information on students enrolled for personal or professional development.
Attributes:
student_id (Primary Key, Foreign Key referencing student_id in Students)
reason_for_enrollment (e.g., "personal interest," "professional development")
program_duration
created_at
updated_at

7. Prospective_Students Table
Purpose: Store information on individuals visiting the institution for potential future enrollment.
Attributes:
prospective_id (Primary Key, Foreign Key referencing student_id in Students)
interest_field (e.g., "engineering," "arts")
intended_program
inquiry_date
notes (e.g., specific questions, areas of interest)
created_at
Updated_at

8. Student_Staff Table
Purpose: Store information on individuals visiting the institution for potential future enrollment.
Attributes:
student_staff_id (Primary Key, Foreign Key referencing student_id in Students)
job_title (e.g., "teaching assistant")
department
employment_start_date
employment_end_date
employment_status
created_at
updated_at

9. Visit_Requests Table
Purpose: Log visits to the Dean's Office and track requests made by students and other users.
Attributes:
visit_request_id (Primary Key)
student_id (Foreign Key referencing student_id in Students)
type_of_visit (e.g., "consultation," "document request," "appointment")
details (description of the request)
time_of_entry (timestamp)
time_of_exit (timestamp)
status (e.g., "in-progress," "completed")
created_at
updated_at

10. Admin Table
Purpose: Store admin-specific information for managing student requests.
Attributes:
admin_id (Primary Key, possibly also a Foreign Key referencing student_id in Students)
department
role (e.g., "Dean's Office Admin," "Financial Aid Admin")
created_at
updated_at

### Relationships

One-to-One: Each student in Students can have additional details in only one of the specific tables (Undergraduate_Students, Graduate_Students, Alumni, Exchange_Visiting_Students, Non_Degree_Students, or Prospective_Students) based on student_type.
One-to-Many: Each student or user in Students can have multiple entries in the Visit_Requests table.
Many-to-One: Each visit request in Visit_Requests is associated with a specific student or user in Students.

### Flow and Interaction

Login/Registration: Users (students and admins) log in using their credentials. The student_type field determines the type of student and directs them to relevant functions.
Visit and Request Logging: Log visits and requests in Visit_Requests with entry and exit timestamps and details.
Admin Management: Admins manage pending visit requests and update statuses. Access control based on role.
Exit Log: Students log their time_of_exit to mark the visit as completed.

## UI / UX

### Process

1. Welcome Screen
Purpose: An entry point for visitors with options based on user type.
Features:
User type selection buttons (Student, Parent, Teacher, Guest).
Button to proceed to the “Enter Concern” form.

2. Enter Concern Form
Purpose: Collect detailed information about the user’s concern.
Database Connection: Adds a new entry in the Concerns table with a user_id reference.
Features:
User Information: Prefilled if the user is already in the system, otherwise prompt for:
Name
Contact Info
User Type (Dropdown: Student, Parent, Teacher, Guest)
Concern Details:
Concern Type (Dropdown: Academic, Behavioral, Administrative, Other)
Description (Text Area)
Submit Button: On submission, data is saved, and the user receives a confirmation message.

3. Visitor Concern Dashboard (for Returning Users) 
Purpose: Allows users to view and track the status of their previously submitted concerns.
Database Connection: Queries the Concerns table filtered by the user_id.
Features:
List of Concerns: Displays all submitted concerns, showing fields:
Concern Type
Status
Date Submitted
Concern Details: Clicking on a concern expands to show the description and any admin updates.
Status Update Notifications: Shows any recent changes in status (e.g., "In Progress", "Resolved").

4. Admin Login and Dashboard
Purpose: Admins can log in to view and manage user concerns.
Database Connection: Provides access to Concerns and Admins tables.
Features:
Login Form: Authenticates the admin based on admin_id and role.
Admin Dashboard:
Overview showing metrics (e.g., Total Concerns, Open Concerns, Resolved Concerns).
Quick links to All Concerns, Pending Concerns, and Resolved Concerns.

5. Concern Management Page (Admin View)
Purpose: Allows admins to review, update, and resolve concerns.
Database Connection: Updates Concerns table based on concern_id.
Features:
Concern List View:
Displays all concerns with filters for status, concern type, or user type.
Clicking on a concern shows full details in a side panel or modal.
Concern Detail Panel:
Shows user information, concern description, and current status.
Action Buttons for updating status (e.g., "In Progress", "Resolved").
Assign Admin Field: Allows selecting a different admin (dropdown populated from Admins table).
Comments: Enables the admin to add internal notes or updates visible to the user.

6. Settings Page (Admin Only)
Purpose: Allows admins to manage their own profiles and view overall system settings.
Database Connection: Accesses the Admins table.
Features:
Profile Management: Allows admins to edit contact info and update their role.
System Settings: Controls for user management, concern types, and status options.