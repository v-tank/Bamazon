// Require necessary packages
var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require("chalk");
const cTable = require("console.table");
const log = console.log;

// Define connection details for database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

// Establish connection
connection.connect(function(err) {
  if (err) throw err;

  console.log("Connection established on id " + connection.threadId + ".\n");

  // Call function to print all items upon start
  printAllItems();
});

// Function to print all items
function printAllItems() {
  // Query to retrieve important info from the table
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
    if (err) throw err;

    console.log("\n");
    console.table(res); // Prints the resulting table in a pretty format
    console.log("\n");
    
    todoPrompt(); // Prompt user to select next steps
  });
}

// Function to prompt user to select what they'd like to do
function todoPrompt() {
  inquirer
    .prompt({
      name: "todo",
      type: "list",
      message: "What would you like to do?",
      choices: ["Purchase an item", "Exit"]
    })
    .then(function(res) {
      // Call corresponding function based on user's choice
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

// Function to purchase an item
function purchaseItem() {
  inquirer
    .prompt([{
      name: "id",
      type: "input",
      message: "What is the ID of the item you'd like to purchase?",
      validate: function(value) {
        if ((isNaN(value) === false) && (value >= 0) && (value != "")) {
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
      // If user confirms, proceed with the purchasing process
      if (response.confirm) {
        // Query to display the item the user selected and to obtain the stock quantity
        var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?"
        connection.query(query, { item_id: response.id }, function(err, res) {
          if (err) throw err;
          
          console.log("\n");
          console.table(res);
          
          // Check if there's enough inventory
          checkInventory(response.quantity, res[0].stock_quantity, res[0].item_id);
        });
      }
      else {
        // Else, return to the main prompt
        todoPrompt();
      }
    });
}

// Function to check if there's enough stock in the inventory
function checkInventory(reqQty, inventoryQty, id) {
  console.log("Checking inventory...");
  // Conditional to to determine whether the user-entered quantity exceeds the inventory
  if (reqQty > inventoryQty) {
    log(chalk.red("Sorry! Insufficient quantity in stock!\n"));
    todoPrompt();
  } else if (reqQty <= inventoryQty) {
    // If there's enough in stock, update the table to subtract the purchased quantity
    log(chalk.green("Item(s) purchased!\n"));
    // Update table
    updateTable(reqQty, id);
  }
}

// Function to update the table with the new quantity
function updateTable(reqQty, id) {
  // Query to subtract the user-desired quantity from the existing quantity in inventory
  var updateQuery = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE ?";
  connection.query(updateQuery, [reqQty, {item_id: id}], function(err, res) {
    if (err) throw err;

  });

  // Query to retrieve the updated info and to calculate the total sales for the item purchased
  var query = "SELECT item_id, product_name, price FROM products WHERE ?"
  connection.query(query, { item_id: id }, function(err, response) {
    if (err) throw err;

    console.log("Your total cost to purchase qty. " + chalk.bgCyan.black(reqQty) + " of " + (response[0].product_name) + " is $" + chalk.bgCyan.black(response[0].price * reqQty) + ".\n");

    var updateSales = "UPDATE products SET product_sales = product_sales + ? WHERE ?";
    connection.query(updateSales, [response[0].price * reqQty, {item_id: id}], function(err, response) {
      if (err) throw err;

      log(chalk.green("Product Sales updated!\n"));
      
      todoPrompt();
    });
  });
}