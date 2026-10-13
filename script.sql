-- INIT SQL


-- =============================================
-- CREATE DATABASE
-- =============================================
USE master;
GO

IF DB_ID('PyJobs') IS NULL
BEGIN
    CREATE DATABASE PyJobs;
END;
GO

-- =============================================
-- SELECT DATABASE
-- =============================================

USE PyJobs;
GO

-- =============================================
-- 1. LOCATION
-- =============================================
CREATE TABLE Location (
    location_id INT PRIMARY KEY,
    city VARCHAR(100) NOT NULL
);
GO

-- =============================================
-- 2. CONTRACT TYPE
-- =============================================
CREATE TABLE contractType (
    contract_id INT PRIMARY KEY,
    type VARCHAR(100) NOT NULL UNIQUE
);
GO

-- =============================================
-- 3. SALARY
-- =============================================
CREATE TABLE salary (
    salary_id INT IDENTITY(1,1) PRIMARY KEY,
    salaryMin INT NOT NULL,
    salaryMax INT NOT NULL,
    CONSTRAINT CK_salary_range CHECK (
        salaryMin >= 0 AND salaryMax >= salaryMin
    )
);
GO

-- =============================================
-- 4. WORK MODE
-- =============================================
CREATE TABLE workMode (
    workMode_id INT PRIMARY KEY,
    type VARCHAR(100) NOT NULL UNIQUE
);
GO

-- =============================================
-- 5. WORK TIME
-- =============================================
CREATE TABLE workTime (
    workTime_id INT PRIMARY KEY,
    type VARCHAR(100) NOT NULL UNIQUE
);
GO

-- =============================================
-- 6. EXPERIENCE LEVEL
-- =============================================
CREATE TABLE expLvl (
    expLevel_id INT PRIMARY KEY,
    type VARCHAR(100) NOT NULL UNIQUE
);
GO

-- =============================================
-- 7. JOB DESCRIPTION
-- =============================================
CREATE TABLE description (
    desc_id INT IDENTITY(1,1) PRIMARY KEY,
    type VARCHAR(MAX) NOT NULL
);
GO

-- =============================================
-- 8. COMPANY
-- =============================================
CREATE TABLE Company (
    company_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
GO

-- =============================================
-- 9. CATEGORY
-- =============================================
CREATE TABLE Category (
    category_id INT PRIMARY KEY,
    category VARCHAR(100) NOT NULL UNIQUE
);
GO

-- =============================================
-- 10. PERSON
-- =============================================
CREATE TABLE Person (
    person_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE
);
GO

-- =============================================
-- 11. JOB ADVERTISEMENT
-- =============================================
CREATE TABLE JobAd (
    job_id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,

    company_id INT NOT NULL,
    category_id INT NOT NULL,
    location_id INT NOT NULL,
    contract_id INT NOT NULL,
    salary_id INT NOT NULL,
    workMode_id INT NOT NULL,
    workTime_id INT NOT NULL,
    expLevel_id INT NOT NULL,
    desc_id INT NOT NULL,

    FOREIGN KEY (company_id) REFERENCES Company(company_id),
    FOREIGN KEY (category_id) REFERENCES Category(category_id),
    FOREIGN KEY (location_id) REFERENCES Location(location_id),
    FOREIGN KEY (contract_id) REFERENCES contractType(contract_id),
    FOREIGN KEY (salary_id) REFERENCES salary(salary_id),
    FOREIGN KEY (workMode_id) REFERENCES workMode(workMode_id),
    FOREIGN KEY (workTime_id) REFERENCES workTime(workTime_id),
    FOREIGN KEY (expLevel_id) REFERENCES expLvl(expLevel_id),
    FOREIGN KEY (desc_id) REFERENCES description(desc_id)
);
GO

-- =============================================
-- 12. APPLICATION
-- =============================================
CREATE TABLE Application (
    application_id INT IDENTITY(1,1) PRIMARY KEY,
    person_id INT NOT NULL,
    job_id INT NOT NULL,
    message VARCHAR(MAX) NOT NULL,
    application_date DATE NOT NULL
        CONSTRAINT DF_Application_Date
        DEFAULT (CONVERT(date, GETDATE())),

    cv_path VARCHAR(500) NULL,

    FOREIGN KEY (person_id) REFERENCES Person(person_id),
    FOREIGN KEY (job_id) REFERENCES JobAd(job_id),

    CONSTRAINT UQ_Application_Person_Job
        UNIQUE (person_id, job_id)
);
GO

-- =============================================
-- REFERENCE DATA: CATEGORIES
-- =============================================
INSERT INTO Category (category_id, category)
VALUES
(1, 'Agriculture, pêche et espaces verts'),
(2, 'Art, artisanat, spectacle et audiovisuel'),
(3, 'Banque, finance et assurance'),
(4, 'Bâtiment et travaux publics (BTP)'),
(5, 'Commerce, vente et grande distribution'),
(6, 'Communication, marketing et publicité'),
(7, 'Droit, justice et administration'),
(8, 'Éducation, formation et recherche'),
(9, 'Environnement, écologie et énergie'),
(10, 'Hôtellerie, restauration, café et tourisme'),
(11, 'Industrie et métallurgie'),
(12, 'Informatique, numérique et télécommunications'),
(13, 'Ingénierie, études et R&D'),
(14, 'Logistique, transport et supply chain'),
(15, 'Ressources humaines (RH) et tertiaire administratif'),
(16, 'Santé et médico-social'),
(17, 'Sécurité, défense et protection'),
(18, 'Services à la personne et aide à domicile'),
(19, 'Social et action sociale'),
(20, 'Sport, animation et loisirs');
GO

-- =============================================
-- REFERENCE DATA: CONTRACT TYPES
-- =============================================
INSERT INTO contractType (contract_id, type)
VALUES
(1, 'CDI'),
(2, 'CDD'),
(3, 'Stage'),
(4, 'Intérim'),
(5, 'Alternance');
GO

-- =============================================
-- REFERENCE DATA: WORK MODES
-- =============================================
INSERT INTO workMode (workMode_id, type)
VALUES
(1, 'Hybride'),
(2, 'Sur place'),
(3, 'Distanciel');
GO

-- =============================================
-- REFERENCE DATA: WORK TIMES
-- =============================================
INSERT INTO workTime (workTime_id, type)
VALUES
(1, 'Temps plein'),
(2, 'Temps partiel');
GO

-- =============================================
-- REFERENCE DATA: EXPERIENCE LEVELS
-- =============================================
INSERT INTO expLvl (expLevel_id, type)
VALUES
(1, 'Débutant (0-1 ans)'),
(2, 'Junior (1-3 ans)'),
(3, 'Intermédiaire (3-5 ans)'),
(4, 'Senior (5-10 ans)'),
(5, 'Expert (10+ ans)');
GO
