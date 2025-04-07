USE F1RacingDatabase;
GO

-- Creating encryption objects
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'F1Racing123!';
GO
CREATE CERTIFICATE F1Cert1 WITH SUBJECT = 'F1 Financial Data Encryption';
GO
CREATE SYMMETRIC KEY F1SymKey1 WITH ALGORITHM = AES_256 ENCRYPTION BY CERTIFICATE F1Cert1;
GO

-- Adding encrypted column for DRIVER table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'DRIVER' AND COLUMN_NAME = 'SalaryEncrypted')
BEGIN
    ALTER TABLE DRIVER ADD SalaryEncrypted VARBINARY(256);
END
GO

-- Adding encrypted column for STAFF table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'STAFF' AND COLUMN_NAME = 'SalaryEncrypted')
BEGIN
    ALTER TABLE STAFF ADD SalaryEncrypted VARBINARY(256);
END
GO

-- Adding encrypted column for TEAM table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'TEAM' AND COLUMN_NAME = 'BudgetEncrypted')
BEGIN
    ALTER TABLE TEAM ADD BudgetEncrypted VARBINARY(256);
END
GO

-- Encrypting DRIVER salaries
OPEN SYMMETRIC KEY F1SymKey1 DECRYPTION BY CERTIFICATE F1Cert1;
UPDATE DRIVER
SET SalaryEncrypted = ENCRYPTBYKEY(KEY_GUID('F1SymKey1'), CONVERT(VARBINARY, Salary));
CLOSE SYMMETRIC KEY F1SymKey1;
GO

-- Encrypting STAFF salaries
OPEN SYMMETRIC KEY F1SymKey1 DECRYPTION BY CERTIFICATE F1Cert1;
UPDATE STAFF
SET SalaryEncrypted = ENCRYPTBYKEY(KEY_GUID('F1SymKey1'), CONVERT(VARBINARY, Salary));
CLOSE SYMMETRIC KEY F1SymKey1;
GO

-- Encrypting TEAM budgets
OPEN SYMMETRIC KEY F1SymKey1 DECRYPTION BY CERTIFICATE F1Cert1;
UPDATE TEAM
SET BudgetEncrypted = ENCRYPTBYKEY(KEY_GUID('F1SymKey1'), CONVERT(VARBINARY, Budget));
CLOSE SYMMETRIC KEY F1SymKey1;
GO

-- Dropping original DRIVER salary column
ALTER TABLE DRIVER DROP COLUMN Salary;
GO

-- Dropping original STAFF salary column
ALTER TABLE STAFF DROP COLUMN Salary;
GO

-- Dropping original TEAM budget column
ALTER TABLE TEAM DROP COLUMN Budget;
GO


-----To access the encrypted data
OPEN SYMMETRIC KEY F1SymKey1 DECRYPTION BY CERTIFICATE F1Cert1;
SELECT 
    Driver_ID,
    Name, 
    CONVERT(MONEY, DECRYPTBYKEY(SalaryEncrypted)) AS Salary
FROM DRIVER;
CLOSE SYMMETRIC KEY F1SymKey1;