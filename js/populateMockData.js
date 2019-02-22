var faker = require('faker');
var mysql = require('mysql');
var data = [];

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'amazonStore_db'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    createMockData();
});

function createMockData() {
    for (var i = 0; i < 20; i++) {
        data.push([
            faker.commerce.productName(),
            faker.commerce.department(),
            faker.commerce.price(),
            faker.random.number()
        ])
    }
    console.log(data);
    populateDB();
}

function populateDB() {
    console.log('populateDB function');
    connection.query(
        "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?", [data],
        function (err, res) {
            if(err) throw err;
            //console.log(res.affectedRows + " product inserted!\n");
            connection.end();
        }
    );
}