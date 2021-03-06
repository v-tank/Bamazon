-- DROP DATABASE IF EXISTS bamazon;
-- CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INTEGER NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER,
  product_sales DECIMAL(10,2) DEFAULT 0.00,
  PRIMARY KEY (item_id)
);

