DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE mogshop (
    id INTEGER NOT NULL AUTO_INCREMENT,
    Item VARCHAR(45) NOT NULL,
    Category VARCHAR(45) NOT NULL,
    Price INTEGER(25) NOT NULL,
    Stock INTEGER(25) NULL,
    PRIMARY KEY (id)
);

INSERT INTO mogshop (Item, Category, Price, Stock)
VALUES
    ("Potion", "Curatives", 40, 99),
    ("Hi-Potion", "Curatives", 150, 50),
    ("X-Potion", "Curatives", 1650, 6),
    ("Antidote", "Curatives", 50, 99),
    ("Eyedrops", "Curatives", 50, 99),
    ("Echo Grass", "Curatives", 50, 99),
    ("Gold Needle", "Curatives", 500, 40),
    ("Remedy", "Curatives", 1500, 20),
    ("Phoenix Down", "Curatives", 800, 15),
    ("Ultima Weapon", "Equipment", 163000, 1),
    ("Feather Cap", "Equipment", 320, 8),
    ("Gold Armor", "Equipment", 2550, 3),
    ("Masamune", "Equipment", 98000, 1),
    ("Leather Boots", "Equipment", 550, 25),
    ("Omnislash", "Manuals", 51200, 1),
    ("All Creation", "Manuals", 45500, 1),
    ("Final Heaven", "Manuals", 62000, 1),
    ("Highwind", "Manuals", 32300, 1),
    ("Knights of the Round", "Materia", 500000, 1),
    ("Bahamut ZERO", "Materia", 250000, 1)