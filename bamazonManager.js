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

  // Call function to prompt the user
  todoPrompt();
});

// Function to prompt user to select what they'd like to do
function todoPrompt() {
  inquirer
    .prompt({
      name: "todo",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    })
    .then(function(res) {
      // Call corresponding function based on user's choice
      switch (res.todo) {
        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          viewLowInventory();
          break;
        case "Add to Inventory":
          addToInventory();
          break;
        case "Add New Product":
          addNewProduct();
          break;
        case "Exit":
          connection.end();
          return;
      }
    });
}

// Function to print all items
function viewProducts() {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
    if (err) throw err;

    console.log("\n");
    console.table(res); // Prints the resulting table in a pretty format
    console.log("\n");

    todoPrompt(); // Prompt user to select next steps
  });
}

// Function to print all items that have a stock quantity of less than 5
function viewLowInventory() {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
    if (err) throw err;

    console.log("\n");
    console.table(res);
    console.log("\n");
    
    todoPrompt();
  });
}

// Function to add new stock to inventory
function addToInventory() {
  inquirer
    .prompt([{
      name: "id",
      type: "input",
      message: "What is the ID of the item you'd like to add more of to the inventory?",
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
      message: "How many units of the product would you like to add to the inventory?"
    },
    {
      name: "confirm",
      type: "confirm",
      message: "Are you sure you'd like to add to the inventory?"
    }
    ])
    .then(function(response) {
      if (response.confirm) {
        // Query to update the stock quantity with the user-inputted value
        var updateQuery = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?";
        connection.query(updateQuery, [response.quantity, {item_id: response.id}], function(err, res) {
          if (err) throw err;

          log(chalk.green("Successfully added " + response.quantity + " units of item ID " +  response.id + " to the inventory.\n"));

          todoPrompt();
        });
      }
      else {
        todoPrompt();
      }
    });
}

// Function to add a new product to the inventory
function addNewProduct() {
  inquirer
    .prompt([{
      name: "productName",
      type: "input",
      message: "What is the name of the product you'd like to add to the inventory?",
    },
    {
      name: "department",
      type: "input",
      message: "To which department does this item belong?"
    },
    {
      name: "price",
      type: "input",
      message: "What is the price of the item?",
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
      message: "How many units would you like to add to the inventory?",
      validate: function(value) {
        if ((isNaN(value) === false) && (value >= 0)) {
          return true;
        }
        return false;
      }
    },
    {
      name: "confirm",
      type: "confirm",
      message: "Are you sure you'd like to add the item to the inventory?"
    }
    ])
    .then(function(response) {
      if (response.confirm) {
        // Query to insert the user-inputted product to the table
        var addQuery = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)";
        connection.query(addQuery, [response.productName, response.department, response.price, response.quantity], function(err, res) {
          if (err) throw err;

          log(chalk.green("Successfully added the product to the inventory.\n"));

          todoPrompt();
        });
      } else {
        todoPrompt();
      }
    });
}