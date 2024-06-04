import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost", //127.0.0.1
  user: "root",
  password: "",
  database: "e-commerce1",
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    }else{
        console.log("Connected to DB");
    }
})


export default connection