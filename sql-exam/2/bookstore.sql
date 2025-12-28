-----------------------------------------------------------
USE master;
GO
IF DB_ID(N'BookstoreDB') IS NOT NULL
BEGIN
    ALTER DATABASE BookstoreDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE BookstoreDB;
END
GO
CREATE DATABASE BookstoreDB;
GO
USE BookstoreDB;
GO

-----------------------------------------------------------
CREATE TABLE Books (
    BookID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Author NVARCHAR(100) NOT NULL,
    Publisher NVARCHAR(100),
    Price DECIMAL(10, 2) NOT NULL,
    Quantity INT NOT NULL
);

CREATE TABLE Sellers (
    SellerID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20)
);

CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20)
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,
    BookID INT NOT NULL,
    SellerID INT NOT NULL,
    OrderDate DATE NOT NULL,
    Quantity INT NOT NULL,
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    CONSTRAINT FK_Orders_Books FOREIGN KEY (BookID) REFERENCES Books(BookID),
    CONSTRAINT FK_Orders_Sellers FOREIGN KEY (SellerID) REFERENCES Sellers(SellerID)
);

-----------------------------------------------------------
SET IDENTITY_INSERT Books ON;
INSERT INTO Books (BookID, Title, Author, Publisher, Price, Quantity) VALUES
(1, N'Gone with the Wind', N'Margaret Mitchell', N'Scribner', 25.50, 15),
(2, N'To Kill a Mockingbird', N'Harper Lee', N'J. B. Lippincott & Co.', 18.00, 30),
(3, N'1984', N'George Orwell', N'Secker & Warburg', 15.00, 50),
(4, N'The Great Gatsby', N'F. Scott Fitzgerald', N'Charles Scribner''s Sons', 22.99, 10);
SET IDENTITY_INSERT Books OFF;

SET IDENTITY_INSERT Sellers ON;
INSERT INTO Sellers (SellerID, Name, Phone) VALUES
(101, N'Sara Mohammadi', N'09121234567'),
(102, N'Ali Ahmadi', N'09129876543'),
(103, N'Reza Karimi', N'09191112233');
SET IDENTITY_INSERT Sellers OFF;

SET IDENTITY_INSERT Customers ON;
INSERT INTO Customers (CustomerID, Name, Phone) VALUES
(201, N'Fatemeh Ebrahimi', N'09355554433'),
(202, N'Majid Saeedi', N'09101012020'),
(203, N'Nazanin Yazdani', N'09153331122'),
(204, N'Javad Norouzi', N'09217778899');
SET IDENTITY_INSERT Customers OFF;

SET IDENTITY_INSERT Orders ON;
INSERT INTO Orders (OrderID, CustomerID, BookID, SellerID, OrderDate, Quantity) VALUES
(301, 201, 1, 101, '2025-01-10', 3), -- GWTW, Jan
(302, 202, 1, 102, '2025-01-15', 2), -- GWTW, Jan
(303, 203, 2, 103, '2025-02-01', 5), -- Mockingbird
(304, 201, 2, 103, '2025-03-05', 4), -- Mockingbird (Customer 201: 3+4=7)
(305, 204, 2, 101, '2025-03-07', 3), -- Mockingbird (Total Mockingbird: 12)
(306, 202, 3, 102, '2025-02-10', 6), -- 1984 (Customer 202: 2+6=8)
(307, 203, 4, 101, '2025-03-01', 1), -- Gatsby (Customer 203: 5+1=6)
(308, 201, 1, 102, '2025-03-10', 1), -- GWTW (Customer 201: 7+1=8)
(309, 201, 3, 103, '2025-04-01', 2), -- 1984 (Customer 201: 8+2=10) -- Top Customer
(310, 202, 4, 101, '2025-04-10', 2); -- Gatsby (Customer 202: 8+2=10) -- Tied for Top Customer
SET IDENTITY_INSERT Orders OFF;

-----------------------------------------------------------
SELECT TOP 1
    B.Title,
    SUM(O.Quantity) AS TotalQuantitySold
FROM
    Orders O
JOIN
    Books B ON O.BookID = B.BookID
GROUP BY
    B.Title
ORDER BY
    TotalQuantitySold DESC;

SELECT TOP 3
    C.Name,
    SUM(O.Quantity) AS TotalBooksBought
FROM
    Orders O
JOIN
    Customers C ON O.CustomerID = C.CustomerID
GROUP BY
    C.Name
ORDER BY
    TotalBooksBought DESC;

SELECT TOP 1
    S.Name,
    SUM(O.Quantity * B.Price) AS TotalRevenue
FROM
    Orders O
JOIN
    Sellers S ON O.SellerID = S.SellerID
JOIN
    Books B ON O.BookID = B.BookID
GROUP BY
    S.Name
ORDER BY
    TotalRevenue ASC;

SELECT
    SUM(O.Quantity * B.Price) AS SalesAmountJanuary
FROM
    Orders O
JOIN
    Books B ON O.BookID = B.BookID
WHERE
    B.Title = N'Gone with the Wind'
    AND MONTH(O.OrderDate) = 1;
