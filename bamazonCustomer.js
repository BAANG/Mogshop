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

function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'enterShop',
            message: chalk.white("What would you like to buy?"),
            choices: ["Buy Consumables", "Buy Equipment", "Buy Rares", "Exit Shop"]
        }
    ]).then(function (response) {
        switch (response.enterShop) {
            case "Buy Consumables":
                console.log(chalk.white("\nWe've got a bunch of potions and curatives in stock!"))
                query = 'SELECT * FROM consumables'
                shopType = "consumables"
                openShop(query);
                break;

            case "Buy Equipment":
                console.log(chalk.white("\nWe just restocked our inventory with some great gear!"))
                query = 'SELECT * FROM equipment'
                shopType = "equipment"
                openShop(query);
                break;

            case "Buy Rares":
                console.log(chalk.white("\nYou've got great taste! Come take a look at these rarities..."))
                query = 'SELECT * FROM rares'
                shopType = "rares"
                openShop(query);
                break;

            case "Exit Shop":
                console.log(chalk.white("\nGet out of here then! Scram!"))
                break;
        }
    })
}

function checkGil() {
    console.log("You currently have: " + chalk.inverse(userGil) + " gil\n")
}


function openShop(query) {
    connection.query(
        query,
        function (error, response) {
            if (error) throw error;

            console.log(response);
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
            checkGil();
            userAction(response);

        }
    )
}

function userAction(sqlResponse) {
    inquirer.prompt([
        {
            type: 'number',
            name: 'item_id',
            message: 'What would you like? [Enter the item ID#] '
        }
    ]).then(function (response) {
        var itemChoice = sqlResponse[response.item_id - 1];
        console.log("This is the item choice: " + itemChoice.Item)

        if (itemChoice.Stock == 0) {
            console.log("\nSorry, we're all sold out.");
            mainMenu();
        } else {
            console.log("This is the amount in stock: " + itemChoice.Stock)
            inquirer.prompt([
                {
                    type: 'number',
                    name: 'quantity',
                    message: '\nHow many would you like to buy?'
                }
            ]).then(function (response) {
                var quantity = response.quantity

                if (quantity > itemChoice.Stock || userGil < itemChoice.Price * quantity) {
                    console.log("\nSorry, we don't have enough of that item to sell to you.");
                    mainMenu();
                } else {
                    inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'confirm',
                            message: "\nYou'd like to buy " + quantity + "x " + itemChoice.Item + "(s) for " + itemChoice.Price * quantity + " Correct?"
                        }
                    ]).then(function (response) {
                        if (!response.confirm) {
                            console.log("\n Don't be wasting my time then!")
                        } else {
                            userGil -= itemChoice.Price * quantity;
                            checkGil();
                            var newQuantity = itemChoice.Stock - quantity
                            updateShop(shopType, newQuantity, itemChoice.id)
                        }
                    })
                }
            })
        }
    })
}

function updateShop(shopTable, newQuantity, itemID) {
    switch (shopTable) {
        case "consumables":
            sqlQuery = "UPDATE consumables SET ? WHERE ?";
            break;
        case "equipment":
            sqlQuery = "UPDATE equipment SET ? WHERE ?";
            break;
        case "rares":
            sqlQuery = "UPDATE rares SET ? WHERE ?";
            break;
    }
    var query = connection.query(
        sqlQuery,
        [
            {
                Stock: newQuantity
            },
            {
                id: itemID
            }
        ],
        function (error, response) {
            if (error) throw error;

            console.log("Stock for " + response.affectedRows + " item(s) updated!")
            mainMenu();
        }
    )
    console.log(query.sql)
}


