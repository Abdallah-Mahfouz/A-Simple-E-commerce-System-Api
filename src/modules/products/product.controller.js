import connection from "../../../db/models/connectionDB.js";

//================================================================
//==================    getProducts   =======================

const getProducts = (req, res, next) => {
  connection.execute(`select * from customer`, (err, result) => {
    if (err) {
      res.status(400).json({ message: "query error", err });
    }
    console.log(result);
  });
};
//================================================================
//==================    addProducts   =======================
const addProducts = (req, res, next) => {
  const { product_name, category, unit_price } = req.body;
  const query = `insert into product (product_name,category,unit_price) values ("${product_name}", "${category}", "${unit_price}")`;
  connection.execute(query, (err, result) => {
    if (err) {
      return res.status(400).json({ msg: "query failed", err });
    }
    if (!result.affectedRows) {
      return res.status(400).json({ msg: "fail to added" });
    }
    return res.status(201).json({ msg: "added done" });
  });
};
//================================================================
//=============  getTotalRevenueByCategory  ===============
const getTotalRevenueByCategory = (req, res, next) => {
  const query = `
  SELECT 
    p.category AS category_name,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
  FROM 
    order_items oi
  JOIN 
    product p ON oi.product_id = p.id
  GROUP BY 
    p.category
`;

  connection.execute(query, (err, results) => {
    if (err) {
      return res.status(500).json({ msg: "Query failed", err });
    }
    return res.status(200).json(results);
  });
};
//================================================================
//============= getTotalItemsSoldByProduct  ================
const getTotalItemsSoldByProduct = (req, res, next) => {
  const query = `
      SELECT 
        p.product_name,
        SUM(oi.quantity) AS total_items_sold
      FROM 
        order_items oi
      JOIN 
        product p ON oi.product_id = p.id
      GROUP BY 
        p.product_name
    `;

  connection.execute(query, (err, results) => {
    if (err) {
      return res.status(500).json({ msg: "Query failed", err });
    }
    return res.status(200).json(results);
  });
};
//============================================================================
export {
  getProducts,
  addProducts,
  getTotalRevenueByCategory,
  getTotalItemsSoldByProduct,
};
