var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require("chalk");
const cTable = require("console.table");
const log = console.log;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;

  console.log("Connection established on id " + connection.threadId + ".\n");

  todoPrompt();
});

function todoPrompt() {
  inquirer
    .prompt({
      name: "todo",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Product Sales by Department", "Create New Department", "Exit"]
    })
    .then(function (res) {
      switch (res.todo) {
        case "View Product Sales by Department":
          viewProductSales();
          break;
        case "Create New Department":
          createNewDepartment();
          break;
        case "Exit":
          connection.end();
          return;
      }
    });
}


function viewProductSales() {
  var query = "SELECT departments.`department_id`, departments.`department_name`, departments.`overhead_costs`, SUM(products.`product_sales`) AS product_sales, (-departments.`overhead_costs` + SUM(products.`product_sales`)) AS total_profit FROM departments INNER JOIN products ON departments.`department_name` = products.`department_name` GROUP BY departments.`department_id` ASC;"
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.log("\n");
    console.table(res);

    todoPrompt();
  });
}