import express from "express";
import customerRouter from "./src/modules/customers/customers.routes.js";
import orderRouter from "./src/modules/orders/orders.routes.js";
import productRouter from "./src/modules/products/product.routes.js";
import connection from "./db/models/connectionDB.js";

const app = express();
//============================================================
// ------------- Middleware -----------------

app.use(express.json());
connection;

app.use("/customers", customerRouter);
app.use("/orders", orderRouter);
app.use("/products", productRouter);

//------------------------------------------------------------
// error handling
app.use("*", (req, res) => {
  res.send("error");
});
//------------------------------------------------------------
app.listen(3000, () => console.log("server listening on 3000"));
