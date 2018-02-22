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
});

function printAllItems() {
  connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      console.log(
        "Item ID: " + res[i].item_id + " || " + "Product Name: " + res[i].product_name + " || " + "Price: " + res[i].price
      );
    }
    todoPrompt();
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
      switch (res.todo) {
        case "Purchase an item":
          purchaseItem();
          break;
        case "Exit":
          connection.end();
          return;
      }
    });
}

function purchaseItem() {
  inquirer
    .prompt([{
      name: "id",
      type: "input",
      message: "What is the ID of the item you'd like to purchase?",
      validate: function(value) {
        if ((isNaN(value) === false) && (value >= 0)) {
          return true;
        }
        return false;
      }
    },
    {
      name: "quantity",
      type: "input",
      message: "How many units of the product would you like to purchase?"
    },
    {
      name: "confirm",
      type: "confirm",
      message: "Are you sure you'd like to make the purchase?"
    }
    ])
    .then(function(res) {
      if (res.confirm) {
        console.log(res.id + "; " + res.quantity);
      }
      else {
        todoPrompt();
      }
    });
}