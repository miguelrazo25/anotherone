require("dotenv").config();
var mysql = require("mysql");
var prompt = require("prompt");
var Table = require("cli-table");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("\n   connected to database. \n");
  makeTab();
});

function makeTab() {
  connection.query("SELECT * FROM products", function(err, res) {
    console.table(res, ["item_id", "product_name", "price", "stock_quantity"]);
    buyer(res);
  });
}

function buyer(res) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "selection",
        message: "Whats the ID of the item youd like to buy? Enter E to exit"
      }
    ])
    .then(function(answer) {
      var goodImp = false;

      if (answer.selection.toUpperCase() === "E") {
        console.log("exiting");
        process.exit();
      }
      for (var i = 0; i < res.length; i++) {
        if (res[i].item_id === parseInt(answer.selection)) {
          goodImp = true;
          quant(res[i], res);
          break;
        }
      }

      if (!goodImp) {
        console.log("no item found");
        buyer(res);
      }
    });
}

function quant(product, productList) {
  inquirer
    .prompt({
      type: "input",
      name: "quantity",
      message: "How much of said item would you like to purchase?"
    })
    .then(function(answer) {
      if (product.stock_quantity >= answer.quantity) {
        connection.query(
          'UPDATE products SET stock_quantity="' +
            (product.stock_quantity - answer.quantity) +
            '", product_sales="' +
            (product.product_sales + answer.quantity * product.price) +
            '" WHERE item_id="' +
            product.item_id +
            '"',
          function() {
            connection.query(
              "UPDATE departments SET total_sales=total_sales+" +
                answer.quantity * product.price +
                ' WHERE department_name="' +
                product.department_name +
                '"',
              function() {
                console.log(
                  "\n  Purchased " +
                    answer.quantity +
                    ' of "' +
                    product.product_name +
                    '" for $' +
                    (answer.quantity * product.price).toFixed(2) +
                    ". \n"
                );
              }
            );
            makeTab();
          }
        );
      } else if (product.stock_quantity < answer.quantity) {
        console.log(
          "There are " +
            product.stock_quantity +
            " remaining in anotherOne. Try Again."
        );
        buyer(productList);
      }
    });
}
