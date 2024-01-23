# Users

| Column       |  Type   |
| ------------ | :-----: |
| user_id      | integer |
| created_at   | string  |
| updated_at   | string  |
| owner        | integer |
| is_active    | boolean |
| first_name   | string  |
| last_name    | string  |
| phone_number | string  |
| email        | string  |
| role         |  enum   |
| password     | string  |

# Campuses

| Column     |  Type   |
| ---------- | :-----: |
| campus_id  | integer |
| created_at | string  |
| updated_at | string  |
| owner      | integer |
| is_active  | boolean |
| name       | string  |

# Sorting Days

| Column         |  Type   |
| -------------- | :-----: |
| sorting_day_id | integer |
| created_at     | string  |
| updated_at     | string  |
| owner          | integer |
| is_active      | boolean |
| date           |  date   |
| campus_id      | integer |
| user_id        | integer |
| notes          |  text   |

# Classes

| Column     |  Type   |
| ---------- | :-----: |
| class_id   | integer |
| created_at | string  |
| updated_at | string  |
| owner      | integer |
| is_active  | boolean |
| name       | string  |
| campus_id  | integer |
| start_date |  date   |
| end_date   |  date   |
| status     |  enum   |

# Courses

| Column        |  Type   |
| ------------- | :-----: |
| course_id     | integer |
| created_at    | string  |
| updated_at    | string  |
| owner         | integer |
| is_active     | boolean |
| name          | string  |
| category      |  enum   |
| start_date    |  date   |
| duration_term |  enum   |
| duration_num  | integer |

# Grades

| Column     |  Type   |
| ---------- | :-----: |
| grade_id   | integer |
| created_at | string  |
| updated_at | string  |
| owner      | integer |
| is_active  | boolean |
| student_id | integer |
| parent     |  enum   |
| parent_id  | integer |
| num_grade  | integer |
| text       |  text   |

# Interviews

| Column       |  Type   |
| ------------ | :-----: |
| interview_id | integer |
| created_at   | string  |
| updated_at   | string  |
| owner        | integer |
| is_active    | boolean |
| customer_id  | integer |
| date         |  date   |
| position     | string  |


# Students

| Column     |  Type   |
| ---------- | :-----: |
| student_id | integer |
| created_at | string  |
| updated_at | string  |
| owner      | integer |
| is_active  | boolean |
| first_name | string  |
| last_name  | string  |
| status     |  enum   |
| email      | string  |
| id_number  | string  |
| phone      | string  |
| class_id   | integer |

# Previous Information

| Column                       |  Type   |
| ---------------------------- | :-----: |
| student_id                   | integer |
| created_at                   | string  |
| updated_at                   | string  |
| owner                        | integer |
| is_active                    | boolean |
| current_occupation           | string  |
| previous_jobs                | string  |
| average_salary_previous_jobs | integer |
| military_service             | string  |
| why_interested               | string  |
| english_skills               |  enum   |
| math_skills                  |  enum   |
| programming_skills           |  enum   |
| call_date                    |  date   |
| puzzle_solution              |  text   |
| puzzle_solution_comments     |  text   |
| general_comments             |  text   |
| caller                       | string  |
| concluding_comments          |  text   |

# Missions

| Column     |  Type   |
| ---------- | :-----: |
| mission_id | integer |
| created_at | string  |
| updated_at | string  |
| owner      | integer |
| is_active  | boolean |
| course_id  | integer |
| name       | string  |
| category   |  enum   |

# Feedback

| Column      |  Type   |
| ----------- | :-----: |
| feedback_id | integer |
| created_at  | string  |
| updated_at  | string  |
| owner       | integer |
| is_active   | boolean |
| student_id  | integer |
| date        |  date   |
| title       | string  |
| user_id     | integer |
| rank        | integer |
| text        |  text   |

# Events

| Column      |  Type   |
| ----------- | :-----: |
| event_id    | integer |
| created_at  | string  |
| updated_at  | string  |
| owner       | integer |
| is_active   | boolean |
| student_id  | integer |
| customer_id | integer |
| name        | string  |
| date        | string  |
| text        |  text   |

# Sorting Schedule

| Column            |  Type   |
| ----------------- | :-----: |
| student_id        | integer |
| created_at        | string  |
| updated_at        | string  |
| owner             | integer |
| is_active         | boolean |
| date              |  date   |
| invited           | boolean |
| arrival_time      |  time   |
| symbols           | string  |
| cubes             | string  |
| automated_exam    | string  |
| interviewer_notes |  text   |
| status            |  enum   |
| notes             |  text   |

# Contract Status

| Column           |  Type   |
| ---------------- | :-----: |
| student_id       | integer |
| created_at       | string  |
| updated_at       | string  |
| owner            | integer |
| is_active        | boolean |
| invited          | boolean |
| arrival_verified | boolean |
| contract_signed  | boolean |
| signing_date     |  date   |
| comments         |  text   |

# Customers

| Column        |  Type   |
| ------------- | :-----: |
| customer_id   | integer |
| created_at    | string  |
| updated_at    | string  |
| owner         | integer |
| is_active     | boolean |
| name          | string  |
| address       | string  |
| contact_name  | string  |
| contact_phone | string  |
| contact_email | string  |
| notes         |  text   |

# Technologies

| Column        |  Type   |
| ------------- | :-----: |
| technology_id | integer |
| created_at    | string  |
| updated_at    | string  |
| owner         | integer |
| is_active     | boolean |
| name          | string  |

# Documents

| Column        |  Type   |
| ------------- | :-----: |
| document_id   | integer |
| created_at    | string  |
| updated_at    | string  |
| owner         | integer |
| is_active     | boolean |
| document_type |  enum   |
| document_file | string  |
| notes         |  text   |

# Course Students

| Column            |  Type   |
| ----------------- | :-----: |
| course_student_id | integer 
| course_id         | integer |
| student_id        | integer |

# Graduate Interviews

| Column                 |  Type   |
| ---------------------- | :-----: |
| student_interview_id   | integer |
| student_id             | integer |
| interview_id           | integer |
| status                 |  enum   |
| interview_feedback     | integer |

# Sorting Day Candidates

| Column                  |  Type   |
| ----------------------- | :-----: |
| sorting_day_student_id  | integer |
| sorting_day_id          | integer |
| student_id              | integer |

# Class Courses

| Column           |  Type   |
| ---------------- | :-----: |
| class_course_id  | integer |
| class_id         | integer |
| course_id        | integer |

# Mission Students

| Column             |  Type   |
| ------------------ | :-----: |
| mission_student_id | integer |
| mission_id         | integer |
| student_id         | integer |

# Candidate Documents

| Column               |  Type   |
| -------------------- | :-----: |
| student_document_id  | integer |
| student_id           | integer |
| document_id          | integer |

# Customer Technologies

| Column                  |  Type   |
| ----------------------- | :-----: |
| customer_technology_id  | integer |
| customer_id             | integer |
| technology_id           | integer |

# Interview Technologies

| Column                   |  Type   |
| ------------------------ | :-----: |
| interview_technology_id  | integer |
| interview_id             | integer |
| technology_id            | integer |

# Customer Interviews

| Column                 |  Type   |
| ---------------------- | :-----: |
| customer_interview_id  | integer |
| customer_id            | integer |
| interview_id           | integer |