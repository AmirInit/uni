-----------------------------------------------------------
USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'HotelDB')
BEGIN
    ALTER DATABASE HotelDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE HotelDB;
END
GO

CREATE DATABASE HotelDB;
GO

USE HotelDB;
GO

-----------------------------------------------------------
CREATE TABLE Rooms (
    RoomID INT IDENTITY(1,1) PRIMARY KEY,
    RoomNumber INT NOT NULL UNIQUE,
    Type NVARCHAR(50) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Status NVARCHAR(20) NOT NULL CHECK (Status IN (N'Available', N'Occupied', N'Maintenance'))
);

CREATE TABLE Guests (
    GuestID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20) NOT NULL
);

CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Position NVARCHAR(50) NOT NULL,
    Phone NVARCHAR(20) NOT NULL
);

CREATE TABLE Reservations (
    ReservationID INT IDENTITY(1,1) PRIMARY KEY,
    GuestID INT NOT NULL,
    RoomID INT NOT NULL,
    EmployeeID INT NOT NULL,
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    CONSTRAINT FK_Reservations_Guests FOREIGN KEY (GuestID) REFERENCES Guests(GuestID),
    CONSTRAINT FK_Reservations_Rooms FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID),
    CONSTRAINT FK_Reservations_Employees FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
);
GO

-----------------------------------------------------------
INSERT INTO Rooms (RoomNumber, Type, Price, Status) VALUES
(101, N'Single', 100.00, N'Available'),    -- RoomID 1
(102, N'Double', 150.00, N'Occupied'),     -- RoomID 2
(103, N'Suite', 300.00, N'Available'),     -- RoomID 3
(104, N'Double', 150.00, N'Available'),    -- RoomID 4
(105, N'Single', 100.00, N'Maintenance');  -- RoomID 5

INSERT INTO Guests (FullName, Phone) VALUES
(N'Alice Johnson', N'555-0101'), -- GuestID 1
(N'Bob Smith', N'555-0102'),     -- GuestID 2
(N'Charlie Davis', N'555-0103'), -- GuestID 3
(N'Diana Evans', N'555-0104');   -- GuestID 4

INSERT INTO Employees (FullName, Position, Phone) VALUES
(N'John Doe', N'Receptionist', N'555-1001'), -- EmployeeID 1
(N'Jane Roe', N'Manager', N'555-1002');      -- EmployeeID 2

INSERT INTO Reservations (GuestID, RoomID, EmployeeID, CheckInDate, CheckOutDate) VALUES
(1, 1, 1, '2023-10-01', '2023-10-05'), -- RoomID 1 (Room 101)
(2, 2, 1, '2023-10-02', '2023-10-04'), -- RoomID 2 (Room 102)
(3, 1, 2, '2023-10-10', '2023-10-12'), -- RoomID 1 (Room 101)
(4, 3, 1, '2023-10-15', '2023-10-20'), -- RoomID 3 (Room 103)
(1, 1, 1, '2023-11-01', '2023-11-03'), -- RoomID 1 (Room 101)
(2, 4, 2, '2023-11-05', '2023-11-07'); -- RoomID 4 (Room 104)
GO

-----------------------------------------------------------
SELECT TOP 1 WITH TIES
    r.RoomNumber,
    r.Type,
    COUNT(res.ReservationID) AS ReservationCount
FROM Rooms r
INNER JOIN Reservations res ON r.RoomID = res.RoomID
GROUP BY r.RoomID, r.RoomNumber, r.Type
ORDER BY ReservationCount DESC;
GO