USE bamazon;

CREATE TABLE departments (
  department_id INTEGER NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  overhead_costs DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
  PRIMARY KEY (department_id)
);
