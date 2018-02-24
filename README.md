# Bamazon

## Table of Contents 

1. [Overview](#overview)
2. [Installation](#installation)
3. [Customer View](#customer)
4. [Manager View](#manager)
5. [Supervisor View](#supervisor)

<a name="overview"></a>
## Overview

Bamazon is a Node.js command-line app that uses MySQL to keep track of the store's available products and departments. It takes in orders from customers and updates the stock in the store's inventory. It also calculates the total sales for each product and department.

<a name="installation"></a>
## Installation

### Step 1: Git Clone

Clone Bamazon to your local git repo like the following:

```
git clone git@github.com:v-tank/Bamazon.git
```

### Step 2: Install Dependencies

Dependencies used for this app include the following: 
* mysql
* inquirer
* chalk
* console.table

Install all the required packages using the following command:

```
npm install or npm i
```

<a name="customer"></a>
## Customer View

1. Run the Node app called `bamazonCustomer.js` using the following command:

	```
	node bamazonCustomer.js
	```

	Running the app will automatically display all the items available for sale. Each item will have the following information:

		- Item ID
		- Product Name
		- Price
		- Stock Quantity

2. The app will then prompt the customer with two options:

	- Purchase an item
	- Exit
  
3. If the customer would like to purchase an item, they'll be prompted with options to choose the ID of the item they'd like to buy as well as the quantity needed.

3. Once the customer has placed an order, the app will query the database to see if the store has enough of the product to meet the customer's request.

	- If **yes**, the app will fulfill the customer's order and show the customer the total cost of their purchase.
	- If **no**, the app will inform the customer there is insufficient quantity in stock and prevent the order from going through.

4. After the transaction is over, the user can continue to make purchases or exit the app.

![Bamazon Customer](https://media.giphy.com/media/F0z2SM8i13xjNMxXEi/giphy.gif)

<a name="manager"></a>
## Manager View

1. Run the Node app called `bamazonManager.js` using the following command:

	```
	node bamazonManager.js
	```

	Running the app will display the following list of menu options:

		- View Products for Sale
		- View Low Inventory
		- Add to Inventory
		- Add New Product
		- Exit

2. Selecting `View Products for Sale` will display all the items available for sale. Each item will have the following information:

	- Item ID
	- Product Name
	- Price
	- Stock Quantity

3. Selecting `View Low Inventory` will display all the items with a stock quantity lower than 5.

4. Selecting `Add to Inventory` will prompt the manager with two messages:

	- Enter the ID of the product they would like to restock.
	- Enter the number of units of the product they would like to restock.

5. Selecting `Add New Product` will prompt the manager with four messsages. Manager should:

	- Enter the name of the product they would like to add.
	- Enter the department name that the product belongs to. 
	- Enter the price per unit of the product they would like to add.
	- Enter the starting stock quantity of the product they would like to add.

6. Selecting `Exit` will exit the app.

![Bamazon Manager](https://media.giphy.com/media/fnBxIKPdmBzsqm0Qgy/giphy.gif)

<a name="supervisor"></a>
## Supervisor View

1. Run the node app called `bamazonSupervisor.js` using the following command:

	```
	node bamazonSupervisor.js
	```

	Running the app will display the following list of options:

		- View Product Sales by Department
		- Create New Department
		- Exit

2. Selecting `View Product Sales by Department` will display a summary of all the departments in the store. Each department will have the following information:

	- Department ID
	- Department Name
	- Overhead Costs
	- Product Sales
	- Total Profit

3. Selecting `Create New Department` wll prompt the supervisor with two messages. Supervisor should:

	- Enter the name of the department they would like to create.
	- Enter the overhead cost of the department they would like to create.

4. Selecting `Exit` will exit the app.

![Bamazon Supervisor](https://media.giphy.com/media/toeleS6B4yfRUsa5fK/giphy.gif)
