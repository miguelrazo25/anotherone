DROP DATABASE IF EXISTS anotherOne;
CREATE DATABASE anotherOne;

USE anotherOne;

CREATE TABLE products(
    item_id INTEGER AUTO_INCREMENT NOT NULL,    
    product_name VARCHAR (30) NOT NULL,  
    department_name VARCHAR (30) NOT NULL,    
    price DECIMAL (11,4) NOT NULL,    
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (item_id)
);

SELECT * FROM anotherOne.products;

USE anotherOne;