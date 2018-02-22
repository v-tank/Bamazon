var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;

  console.log("Connection established on id " + connection.threadId + ".\n");
  printAllItems();
  todoPrompt();
});

function printAllItems() {
  connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      console.log(
        "Item ID: " + res[i].item_id + " || " + "Product Name: " + res[i].product_name + " || " + "Price: " + res[i].price
      );
    }
    connection.end();
  })
}

function todoPrompt() {
  inquirer
    .prompt({
      name: "todo",
      type: "list",
      message: "What would you like to do?",
      choices: ["Purchase an item", "Exit"]
    })
    .then(function(res) {
      switch (res) {
        case "Purchase an item":
          purchaseItem();
          break;
        case "Exit":
          return;
      }
    });
}
