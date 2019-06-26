var inquirer = require('inquirer');
var mysql = require('mysql');
var chalk = require('chalk');
var Table = require('cli-table')

var userGil = 1000000;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function (error) {
    if (error) throw error;

    console.log("Connected as id" + connection.threadId + "\n");
});

console.log("\n###########################\n##Welcome to the Mogshop!##\n###########################\n\n")

mainMenu();

function mainMenu () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'enterShop',
            message: chalk.white("What would you like to buy?"),
            choices: ["Buy Consumables", "Buy Equipment", "Let me see your rares!"]
        }
    ]).then(function (response) {
        switch (response.enterShop) {
            case "Buy Consumables":
                console.log(chalk.white("We've got a bunch of potions and curatives in stock!"))
                openConsumables();
                break;
    
            case "Buy Equipment":
                console.log(chalk.white("We just restocked our inventory with some great gear!"))
                openEquipment();
                break;
    
            case "Let me see your rares!":
                console.log(chalk.white("You've got great taste! Come take a look at these rarities..."))
                openRares();
                break;
        }
    })
}


function openConsumables() {
    var query = connection.query(
        "SELECT * FROM consumables",
        function (error, response) {
            if (error) throw error;

            var table = new Table({
                head: ["Item ID", "Item Name", "Category", "Price (gil)", "Stock"],
                colWidths: [10, 25, 25, 25, 10]
            })
            for (var i = 0; i < response.length; i++) {
                table.push(
                    [response[i].id, response[i].Item, response[i].Category, response[i].Price + " gil", "x" + response[i].Stock]
                );
            }
            console.log(table.toString() + "\n");
            console.log("You currently have: " + chalk.inverse(userGil) + " gil\n")
        }
    )
}
