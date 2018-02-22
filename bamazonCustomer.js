var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require("chalk");
const log = console.log;

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
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      log(
        chalk.red("Item ID: ") + res[i].item_id + " || " + chalk.yellow("Product Name: ") + res[i].product_name + " || " + chalk.cyan("Price: ") + "$" + res[i].price + " || " + chalk.magenta("Quantity in Stock: ") + res[i].stock_quantity
      );
    }
    console.log("\n");
    
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
    .then(function(response) {
      if (response.confirm) {
        // console.log(response.id + "; " + response.quantity);
        var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?"
        connection.query(query, { item_id: response.id }, function(err, res) {
          if (err) throw err;
      
          
            console.log(
              "\n" + chalk.red("Item ID: ") + res[0].item_id + " || " + chalk.yellow("Product Name: ") + res[0].product_name + " || " + chalk.cyan("Price: ") + "$" + res[0].price + " || " + chalk.magenta("Quantity: ") + res[0].stock_quantity
            );
          
          // Check if there's enough inventory
          checkInventory(response.quantity, res[0].stock_quantity, res[0].item_id);
        });
      }
      else {
        todoPrompt();
      }
    });
}

function checkInventory(reqQty, inventoryQty, id) {
  console.log("Checking inventory...");
  if (reqQty > inventoryQty) {
    log(chalk.red("Sorry! Insufficient quantity in stock!\n"));
    todoPrompt();
  } else if (reqQty <= inventoryQty) {
    log(chalk.green("Item(s) purchased!\n"));
    // Update table
    updateTable(reqQty, id);
  }
}

function updateTable(reqQty, id) {
  var updateQuery = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE ?";
  connection.query(updateQuery, [reqQty, {item_id: id}], function(err, res) {
    if (err) throw err;

    // console.log("Table has been updated!");
  });

  var query = "SELECT item_id, product_name, price FROM products WHERE ?"
  connection.query(query, { item_id: id }, function(err, response) {
    if (err) throw err;

    console.log("Your total cost to purchase qty. " + chalk.bgCyan.black(reqQty) + " of " + (response[0].product_name) + " is $" + chalk.bgCyan.black(response[0].price * reqQty) + ".\n");

    todoPrompt();
  });
}
