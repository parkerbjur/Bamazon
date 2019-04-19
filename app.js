const mysql = require("mysql");
const prompts = require("prompts")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "webuser",
    password: "password",
    database: "bamazon"
})

const askQuestions = async () => {
    let questions = [
        {
            type: "number",
            name: "id",
            message: "what product would you like?",
        },
        {
            type: "number",
            name: "quantity",
            message: "How many would you like?"
        }
    ]
    let response = await prompts(questions);
    handleRequest(response.id, response.quantity);
}

function handleRequest(id, amount){
    connection.query("select * from products where item_id = " + id, function(err, res){
        if(err) throw err;
        if(parseInt(res[0].stock_quantity) < amount){
            console.log("Sorry, not enough product");
            connection.end();
            return;
        } else {
            let newStock = res[0].stock_quantity - amount;
            updateStock(newStock, id);
            returnCost(res[0].price, amount)
        }
    });
};

function updateStock (newStock, id) {
    connection.query("update products set stock_quantity = '" + newStock + "'where item_id =" + id, function(err, res){
        if (err) throw err;
    });
    connection.end();
}

function returnCost(price, amount){
    let totalCost = price * amount;
    console.log(`the total cost of your purchase was: ${totalCost}`);
}

askQuestions();