CREATE TABLE CANDIDATES (
company_name TEXT NOT NULL,
interview_date TEXT NOT NULL,
job TEXT NOT NULL)


CREATE TABLE aaa (
company_name TEXT NOT NULL,
interview_date TEXT NOT NULL,
job TEXT NOT NULL);

INSERT INTO aa(company_name, interview_date, job) 
VALUES("אלתא","15.12.22","פייתון")

CREATE TABLE AA (
    first_name INT PRIMARY KEY,
    family_name VARCHAR(255)
);
DROP TABLE InterviewsCandidates;

CREATE TABLE contract_details (
    id INTEGER PRIMARY KEY NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    class INT NOT NULL,
    city TEXT NOT NULL
);

ALTER TABLE `Interviews'Candidates`
RENAME TO InterviewsCandidates;

INSERT INTO InterviewsCandidates (first_name, last_name, class, city)
VALUES
    ('John', 'Doe', 12, 'New York');
    ('Jane', 'Smith', 11, 'Los Angeles'),
    ('Bob', 'Johnson', 10, 'Chicago'),
    ('Alice', 'Williams', 12, 'Houston'),
    ('Charlie', 'Brown', 11, 'San Francisco'),
    ('Eva', 'Davis', 10, 'Miami'),
    ('Frank', 'Moore', 12, 'Seattle'),
    ('Grace', 'Taylor', 11, 'Boston'),
    ('Harry', 'Clark', 10, 'Denver'),
    ('Ivy', 'Martin', 12, 'Austin');
DELETE FROM InterviewsCandidates;
ALTER TABLE InterviewsCandidates
MODIFY id INT NOT NULL;
