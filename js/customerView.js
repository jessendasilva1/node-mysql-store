var inquirer = require('inquirer');
var start = require('../index');
var connection = require('./sqlConnection');

var itemID;
var userQuantity;

function customerView() {
    // show all products before asking what the user wants to do
    inquirer.prompt([{
        name: "itemToBuy",
        message: "Which item would you like to buy?",
        type: "input"
    }]).then(function (answers) {
        if (answers.itemToBuy === "") {
            console.log('Please Enter a Valid ID');
            customerView();
        } else {
            itemID = parseInt(answers.itemToBuy);
            if (isNaN(itemID)) {
                console.log("please enter a valid product ID");
                customerView();
            } else {
                inquirer.prompt([{
                    name: "userQuantity",
                    message: "Enter the amount you want to buy?",
                    type: "input"
                }]).then(function(answer){
                    userQuantity = parseInt(answer.userQuantity);
                    if(isNaN(userQuantity)){
                        console.log("Enter a valid quantity");
                    }else{
                        buyProduct(itemID, userQuantity);
                    }
                })
            }
            //console.log("success");
            //start.startFunction();
        }
    })
}

function buyProduct(itemID, userQuantity){
    connection.query("SELECT * from products WHERE item_id = ?", [itemID], function(err, res){
        if(res.stock_quantity <= 0){
            console.log("There is no more of that product left in stock");
            customerView();
        }else{
            var newStock = res[0].stock_quantity -= userQuantity;
            console.log("\nYou successfully bought the item:");
            console.log("-------------------------------------------------");
            console.log("Product ID: " + res[0].item_id);
            console.log("Product Name: " + res[0].product_name);
            console.log("Department: " + res[0].department_name);
            console.log("Price: " + res[0].price);
            console.log("Stock Left: " + res[0].stock_quantity);
            console.log("-------------------------------------------------");
            console.log("Total Cost is: " + parseInt(userQuantity * res[0].price));
            updateProduct(newStock, res[0]);
        }
    })
}

function updateProduct(updatedStock, dbProduct){
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [updatedStock, dbProduct.item_id], function(err, res){
        if(err) throw err;
        //console.log(res.affectedRows);
        //console.log("successfully updated product");
        start.startFunction();
    })
}

module.exports = function displayItems() {

    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("-------------------------------------------------");
            console.log("Product ID: " + res[i].item_id);
            console.log("Product Name: " + res[i].product_name);
            console.log("Department: " + res[i].department_name);
            console.log("Price: " + res[i].price);
            console.log("Stock Left: " + res[i].stock_quantity);
            console.log("-------------------------------------------------\n");
        }
        customerView();
    })
}