DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE DATABASE bamazon_db;

CREATE TABLE products (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    department VARCHAR(45) NOT NULL,
    price INTEGER(1000, 2),
    stock INTEGER(100),
    PRIMARY KEY (id)
)
