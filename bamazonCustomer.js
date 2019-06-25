var inquirer = require('inquirer');
var mysql = require('mysql');
var chalk = require('chalk');
var table = require('cli-table')

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});


connection.connect(function (error) {
    if (error) throw error;

    console.log("Connected as id" + connection.threadId + "\n")
})