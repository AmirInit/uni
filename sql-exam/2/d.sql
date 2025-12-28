-- حذف جداول به ترتیب وابستگی (ابتدا جدول سفارشات که کلید خارجی دارد)
-- Dropping tables in correct order to avoid Foreign Key constraint errors

IF OBJECT_ID('dbo.Orders', 'U') IS NOT NULL
    DROP TABLE dbo.Orders;
GO

IF OBJECT_ID('dbo.Customers', 'U') IS NOT NULL
    DROP TABLE dbo.Customers;
GO

IF OBJECT_ID('dbo.Sellers', 'U') IS NOT NULL
    DROP TABLE dbo.Sellers;
GO

IF OBJECT_ID('dbo.Books', 'U') IS NOT NULL
    DROP TABLE dbo.Books;
GO

PRINT 'All tables have been successfully deleted.';