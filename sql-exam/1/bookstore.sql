-- ---------------------------------------------------------
-- بخش ۱: پاکسازی و ساخت دیتابیس (Reset)
-- ---------------------------------------------------------
USE master;
GO

-- اگر دیتابیس از قبل بود، آن را پاک کن (این خط جلوی ارور تکراری را می‌گیرد)
IF EXISTS(SELECT * FROM sys.databases WHERE name = 'BookstoreDB')
BEGIN
    ALTER DATABASE BookstoreDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE; -- قطع دسترسی بقیه
    DROP DATABASE BookstoreDB; -- حذف دیتابیس
END
GO

-- حالا دیتابیس جدید را بساز
CREATE DATABASE BookstoreDB;
GO

USE BookstoreDB;
GO

-- ---------------------------------------------------------
-- بخش ۲: ساخت جدول‌ها (Tables)
-- ---------------------------------------------------------

-- جدول فروشندگان
CREATE TABLE Sellers (
    SellerID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Phone VARCHAR(20)
);

-- جدول مشتریان
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Phone VARCHAR(20)
);

-- جدول کتاب‌ها
CREATE TABLE Books (
    BookID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Author NVARCHAR(100),
    Publisher NVARCHAR(100),
    Price DECIMAL(10, 2),
    Quantity INT
);

-- جدول سفارشات (رابطه چند به چند)
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT,
    BookID INT,
    SellerID INT,
    OrderDate DATE DEFAULT GETDATE(),
    Quantity INT,
    
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID),
    FOREIGN KEY (SellerID) REFERENCES Sellers(SellerID)
);
GO

-- ---------------------------------------------------------
-- بخش ۳: ورود داده‌های تستی (Mock Data)
-- ---------------------------------------------------------
INSERT INTO Customers (Name, Phone) VALUES 
(N'Ali', '09121111111'), 
(N'Reza', '09122222222'), 
(N'Sara', '09123333333');

INSERT INTO Sellers (Name, Phone) VALUES 
(N'Ahmadi', '021111'), 
(N'Karimi', '021222');

INSERT INTO Books (Title, Author, Publisher, Price, Quantity) VALUES 
('Gone with the Wind', 'Margaret Mitchell', 'Macmillan', 50000, 10),
('Harry Potter', 'J.K. Rowling', 'Bloomsbury', 120000, 50),
('Clean Code', 'Robert Martin', 'Pearson', 95000, 20);

-- سفارش‌ها (ماه ۱ میلادی = ژانویه)
INSERT INTO Orders (CustomerID, BookID, SellerID, OrderDate, Quantity) VALUES 
(1, 1, 1, '2024-01-15', 2), -- خرید در ژانویه
(2, 2, 2, '2024-02-20', 1),
(3, 1, 1, '2024-01-10', 5), -- خرید در ژانویه
(1, 3, 2, '2024-03-05', 1),
(1, 2, 1, '2024-01-25', 10);
GO

-- ---------------------------------------------------------
-- بخش ۴: جواب سوالات امتحان (Queries)
-- ---------------------------------------------------------

-- سوال ۱: پرفروش‌ترین کتاب؟
SELECT TOP 1 B.Title, SUM(O.Quantity) as TotalSold
FROM Orders O
JOIN Books B ON O.BookID = B.BookID
GROUP BY B.Title
ORDER BY TotalSold DESC;

-- سوال ۲: سه مشتری برتر؟
SELECT TOP 3 C.Name, SUM(O.Quantity) as TotalBought
FROM Orders O
JOIN Customers C ON O.CustomerID = C.CustomerID
GROUP BY C.Name
ORDER BY TotalBought DESC;

-- سوال ۳: کم‌فروش‌ترین فروشنده؟
SELECT TOP 1 S.Name, SUM(O.Quantity) as TotalSales
FROM Orders O
JOIN Sellers S ON O.SellerID = S.SellerID
GROUP BY S.Name
ORDER BY TotalSales ASC;

-- سوال ۴: فروش کتاب "برباد رفته" در ژانویه؟
SELECT SUM(O.Quantity) as JanuarySales
FROM Orders O
JOIN Books B ON O.BookID = B.BookID
WHERE B.Title = 'Gone with the Wind' 
  AND MONTH(O.OrderDate) = 1;
GO