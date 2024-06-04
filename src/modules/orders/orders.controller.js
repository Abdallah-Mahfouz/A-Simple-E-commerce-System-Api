import connection from "../../../db/models/connectionDB.js";

//============================================================================
//==================   getOrders   =======================

const getOrders = (req, res, next) => {
  connection.execute(`select * from customer`, (err, result) => {
    if (err) {
      res.status(400).json({ message: "query error", err });
    }
    console.log(result);
  });
};
//============================================================================
//==================    createOrder   =======================
const createOrder = (req, res, next) => {
  const { customer_id, order_date, order_items } = req.body;
  const order = [customer_id, order_date, total_amount];
  //================
  // calculate the total amount for the order
  const total_amount = order_items.reduce(
    (total, item) => total + item.quantity * item.unit_price,
    0
  );
  //================
  // Insert the order into the orders table
  const query = `
      INSERT INTO orders (customer_id, order_date, total_amount)
      VALUES (?, ?, ?)
    `;
  connection.execute(query, order, (err, result) => {
    if (err) {
      console.error("Insert order failed:", err);
      return res.status(500).json({ msg: "Insert order failed", err });
    }
    const orderId = result.insertId;
    //================
    // Insert the order items into the order_items table
    const insertOrderItemsQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES ?
      `;

    const orderItemsValues = order_items.map((item) => [
      orderId,
      item.product_id,
      item.quantity,
      item.unit_price,
    ]);

    connection.query(
      insertOrderItemsQuery,
      [orderItemsValues],
      (err, orderItemsResult) => {
        if (err) {
          console.error("Insert order items failed:", err);
          return res
            .status(500)
            .json({ msg: "Insert order items failed", err });
        }

        return res
          .status(201)
          .json({ msg: "Order created successfully", order_id: orderId });
      }
    );
  });
};

//============================================================================
//==================    AverageOrderValue   =======================
const getAverageOrderValue = (req, res, next) => {
  const query = `
    SELECT AVG(total_amount) AS average_order_value
    FROM orders
  `;

  connection.execute(query, (err, result) => {
    if (err) {
      console.error("Query failed:", err);
      return res.status(500).json({ msg: "Query failed", err });
    }

    const averageOrderValue = result[0].average_order_value;
    return res.status(200).json({ average_order_value: averageOrderValue });
  });
};
//============================================================================
//==================    Customers-With-No-Orders   =======================
const getCustomersWithNoOrders = (req, res, next) => {
  const query = `
    SELECT c.id, c.first_name, c.last_name, c.email, c.phone
    FROM customer c
    LEFT JOIN orders o ON c.id = o.customer_id
    WHERE o.id IS NULL
  `;

  connection.execute(query, (err, results) => {
    if (err) {
      console.error("Query failed:", err);
      return res.status(500).json({ msg: "Query failed", err });
    }

    return res
      .status(200)
      .json({ msg: "Customers with no orders", customers: results });
  });
};
//============================================================================
//==================   TopCustomer   =======================
const getTopCustomer = (req, res, next) => {
  const query = `
    SELECT 
      c.id, 
      c.first_name, 
      c.last_name, 
      c.email, 
      c.phone,
      SUM(oi.quantity) AS total_items
    FROM 
      customer c
    JOIN 
      orders o ON c.id = o.customer_id
    JOIN 
      order_items oi ON o.id = oi.order_id
    GROUP BY 
      c.id, c.first_name, c.last_name, c.email, c.phone
    ORDER BY 
      total_items DESC
    LIMIT 1
  `;

  connection.execute(query, (err, results) => {
    if (err) {
      console.error("Query failed:", err);
      return res.status(500).json({ msg: "Query failed", err });
    }

    if (results.length === 0) {
      return res.status(404).json({ msg: "No customers found" });
    }

    return res
      .status(200)
      .json({ msg: "Top customer found", customer: results[0] });
  });
};

//============================================================================
//========= TheTop 10 Customers Who Have Spent The Most Money   ===========
const getTopSpendingCustomers = (req, res, next) => {
  const query = `
    SELECT 
      c.id, 
      c.first_name, 
      c.last_name, 
      c.email, 
      c.phone,
      SUM(o.total_amount) AS total_spent
    FROM 
      customer c
    JOIN 
      orders o ON c.id = o.customer_id
    GROUP BY 
      c.id, c.first_name, c.last_name, c.email, c.phone
    ORDER BY 
      total_spent DESC
    LIMIT 10
  `;

  connection.execute(query, (err, results) => {
    if (err) {
      console.error("Query failed:", err);
      return res.status(500).json({ msg: "Query failed", err });
    }

    if (results.length === 0) {
      return res.status(404).json({ msg: "No customers found" });
    }

    return res
      .status(200)
      .json({ msg: "Top spending customers found", customers: results });
  });
};
//============================================================================
//=======   get all customers who have made at least 5 orders   =========
const getCustomersWithAtLeastFiveOrders = (req, res, next) => {
  const query = `
    SELECT 
      c.id, 
      c.first_name, 
      c.last_name, 
      c.email, 
      c.phone,
      COUNT(o.id) AS order_count
    FROM 
      customer c
    JOIN 
      orders o ON c.id = o.customer_id
    GROUP BY 
      c.id, c.first_name, c.last_name, c.email, c.phone
    HAVING 
      COUNT(o.id) >= 5
  `;

  connection.execute(query, (err, results) => {
    if (err) {
      console.error("Query failed:", err);
      return res.status(500).json({ msg: "Query failed", err });
    }

    if (results.length === 0) {
      return res.status(404).json({ msg: "No customers found" });
    }

    return res.status(200).json({ msg: "Customers found", customers: results });
  });
};
//============================================================================
//===   the percentage of customers who have made more than one order   ===
const getPercentageOfMultipleOrderCustomers = (req, res, next) => {
  const totalCustomersQuery =
    "SELECT COUNT(*) AS total_customers FROM customer";
  const multipleOrderCustomersQuery = `
    SELECT COUNT(*) AS customers_with_multiple_orders
    FROM (
      SELECT customer_id
      FROM  orders
      GROUP BY customer_id
      HAVING COUNT(id) > 1
    ) AS subquery
  `;

  connection.execute(totalCustomersQuery, (err, totalResults) => {
    if (err) {
      console.error("Total customers query failed:", err);
      return res.status(500).json({ msg: "Total customers query failed", err });
    }

    const totalCustomers = totalResults[0].total_customers;

    connection.execute(
      multipleOrderCustomersQuery,
      (err, multipleOrderResults) => {
        if (err) {
          console.error("Multiple order customers query failed:", err);
          return res
            .status(500)
            .json({ msg: "Multiple order customers query failed", err });
        }

        const customersWithMultipleOrders =
          multipleOrderResults[0].customers_with_multiple_orders;

        if (totalCustomers === 0) {
          return res
            .status(200)
            .json({ msg: "No customers found", percentage: 0 });
        }

        const percentage = (customersWithMultipleOrders / totalCustomers) * 100;

        return res.status(200).json({
          msg: "Percentage calculated",
          percentage: percentage.toFixed(2),
        });
      }
    );
  });
};

//============================================================================
//=======   get the customer who made the earliest order   ========
const getCustomerWithEarliestOrder = (req, res, next) => {
  const query = `
    SELECT 
      c.id, 
      c.first_name, 
      c.last_name, 
      c.email, 
      c.phone,
      o.order_date
    FROM 
      customer c
    JOIN 
      orders o ON c.id = o.customer_id
    ORDER BY 
      o.order_date ASC
    LIMIT 1
  `;

  connection.execute(query, (err, results) => {
    if (err) {
      console.error("Query failed:", err);
      return res.status(500).json({ msg: "Query failed", err });
    }

    if (results.length === 0) {
      return res.status(404).json({ msg: "No orders found" });
    }

    return res
      .status(200)
      .json({ msg: "Customer found", customer: results[0] });
  });
};

//============================================================================
export {
  getOrders,
  createOrder,
  getAverageOrderValue,
  getCustomersWithNoOrders,
  getTopCustomer,
  getTopSpendingCustomers,
  getCustomersWithAtLeastFiveOrders,
  getPercentageOfMultipleOrderCustomers,
  getCustomerWithEarliestOrder,
};
