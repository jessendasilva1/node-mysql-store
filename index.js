var inquirer = require("inquirer");
var customerView = require('./js/customerView');
var connection = require('./js/sqlConnection');

var startFunction = function start() {
	inquirer
		.prompt([
			{
				name: "view",
				message: "What view would you like to see?",
				type: "list",
				choices: ["Customer View", "Manager View", "Supervisor View", "Exit"]
			}
		])
		.then(function(answers) {
			switch (answers.view) {
                case "Customer View":
					customerView();
					break;

				case "Manager View":
					
					break;

				case "Supervisor View":
					
					break;

				case "Exit":
                    console.log("Exiting the program");
                    connection.end();
					return;

				default:
					break;
			}
		});
}

startFunction();

exports.startFunction = startFunction;