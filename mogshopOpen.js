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

    console.log(chalk.bold("\n###########################\n##Welcome to the Mogshop!##\n###########################\n\n"))
    mainMenu();
});

function mainMenu() {
    checkGil();
    inquirer.prompt([
        {
            type: 'list',
            name: 'enterShop',
            message: chalk.yellow("What would you like to buy?"),
            choices: ["Buy Consumables", "Buy Equipment", "Buy Rares", "Exit Shop"]
        }
    ]).then(function (response) {
        switch (response.enterShop) {
            case "Buy Consumables":
                console.log(chalk.yellow("\nWe've got a bunch of potions and curatives in stock!"))
                query = 'SELECT * FROM consumables'
                shopType = "consumables"
                openShop(query);
                break;

            case "Buy Equipment":
                console.log(chalk.yellow("\nWe just restocked our inventory with some great gear!"))
                query = 'SELECT * FROM equipment'
                shopType = "equipment"
                openShop(query);
                break;

            case "Buy Rares":
                console.log(chalk.yellow("\nYou've got great taste! Come take a look at these rarities..."))
                query = 'SELECT * FROM rares'
                shopType = "rares"
                openShop(query);
                break;

            case "Exit Shop":
                console.log(chalk.yellow("\nGet out of here then! Scram!"))
                connection.end()
                break;
        }
    })
}

function checkGil() {
    console.log("You currently have: " + chalk.yellow(userGil + " gil\n"))
}


function openShop(query) {
    connection.query(
        query,
        function (error, response) {
            if (error) throw error;

            // console.log(response);
            table = new Table({
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
            message: chalk.yellow('What would you like? [Enter the item ID#] ')
        }
    ]).then(function (response) {
        var itemChoice = sqlResponse[response.item_id - 1];
        // console.log("This is the item choice: " + itemChoice.Item)
        if (response.item_id === NaN) {
            console.log(chalk.yellow("\nStop messing around.\n"));
            mainMenu();
        } else if (itemChoice.Stock == 0) {
            console.log(chalk.yellow("\nSorry, we're all sold out."));
            mainMenu();
        } else {
            // console.log("This is the amount in stock: " + itemChoice.Stock)
            inquirer.prompt([
                {
                    type: 'number',
                    name: 'quantity',
                    message: chalk.yellow('\nHow many would you like to buy?')
                }
            ]).then(function (response) {
                var quantity = response.quantity

                if (quantity > itemChoice.Stock) {
                    console.log(chalk.yellow("\nSorry, we don't have enough of that item to sell to you.\n"));
                    mainMenu();
                } else if (userGil < itemChoice.Price * quantity) {
                    console.log(chalk.yellow("\nYou don't have enough gil! This isn't a soup kitchen!\n"));
                    mainMenu();
                } else {
                    inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'confirm',
                            message: chalk.yellow("\nYou'd like to buy " + chalk.white(quantity + "x ") + chalk.magenta(itemChoice.Item + "(s) ") + "for " + itemChoice.Price * quantity + " Correct?")
                        }
                    ]).then(function (response) {
                        if (!response.confirm) {
                            console.log("\n Don't be wasting my time then!")
                        } else {
                            userGil -= itemChoice.Price * quantity;
                            checkGil();
                            var newQuantity = itemChoice.Stock - quantity
                            updateShop(shopType, newQuantity, itemChoice.id)
                            updateTable(shopType)
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
            setTimeout(mainMenu, 750);
        }
    )
}

function updateTable(shopType) {
    switch (shopType) {
        case "consumables":
            query = "SELECT * FROM consumables";
            break;
        case "equipment":
            query = "SELECT * FROM equipment";
            break;
        case "rares":
            query = "SELECT * FROM rares";
            break;
    }

    connection.query(
        query,
        function (error, response) {
            if (error) throw error;

            // console.log(response);
            table = new Table({
                head: ["Item ID", "Item Name", "Category", "Price (gil)", "Stock"],
                colWidths: [10, 25, 25, 25, 10]
            })
            for (var i = 0; i < response.length; i++) {
                table.push(
                    [response[i].id, response[i].Item, response[i].Category, response[i].Price + " gil", "x" + response[i].Stock]
                );
            }

            console.log(table.toString() + "\n");
        }
    )
}