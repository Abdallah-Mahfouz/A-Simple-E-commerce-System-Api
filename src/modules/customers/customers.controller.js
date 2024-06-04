import connection from "../../../db/models/connectionDB.js";
//================================================
//===========  getCustomers   ========
const getCustomers = (req, res, next) => {
  connection.execute(`select * from customer`, (err, result) => {
    if (err) {
      res.status(400).json({ msg: "query error", err });
    }
    // console.log(result); //[]
    if (!result.length) {
      return res.status(400).json({ msg: "no customer found" });
    }
    return res.status(200).json({ msg: "done", result });
  });
};
//================================================
//===========  addCustomer   ========
const addCustomer = (req, res, next) => {
  const { first_name, last_name, email, phone } = req.body;
  const values = [first_name, last_name, email, phone];
  const query = `INSERT INTO customer (first_name,last_name,email,phone) VALUES (?,?,?,?)`;
  connection.execute(query, values, (err, result) => {
    if (err) {
      return res.status(400).json({ msg: "query failed", err });
    }

    if (!result.affectedRows) {
      return res.status(400).json({ msg: "fail to added" });
    }
    return res.status(201).json({ msg: "added done" });
  });
};

//================================================
//===========  login   ========
const login = (req, res, next) => {
  const { email, phone } = req.body;
  // Check if all required fields are provided
  if (!email || !phone) {
    return res.status(400).json({ msg: "Email and phone are required" });
  }
  const query = `select  id, email, phone from customer where (email="${email}" and phone="${phone}")`;
  connection.execute(query, (err, result) => {
    if (err) {
      console.error("Query failed:", err);
      return res.status(500).json({ msg: "Query failed", err });
    }
    if (result.length != 0) {
      const { id } = result[0];
      return res.json({ msg: "login..tokens", id });
    } else {
      return res.status(401).json({ msg: "you need to sign in" });
    }
  });
};
//================================================
//===========  updateCustomer   ========
const updateCustomer = (req, res, next) => {
  const { first_name, last_name, email, phone } = req.body;
  const { id } = req.params;
  const query = `update customer set  first_name="${first_name}", last_name="${last_name}", email="${email}", phone="${phone}" where id="${id}"`;
  connection.execute(query, (err, result) => {
    if (err) {
      return res.status(400).json({ msg: "query failed", err });
    }
    if (!result.affectedRows) {
      return res.status(400).json({ msg: "fail to update" });
    }
    return res.status(201).json({ msg: "update done" });
  });
};
//================================================================
//===========  deleteCustomer   ========
const deleteCustomer = (req, res, next) => {
  const { id } = req.params;
  const query = `delete from customer where id="${id}"`;
  connection.execute(query, (err, result) => {
    if (err) {
      return res.status(400).json({ msg: "query failed", err });
    }

    if (!result.affectedRows) {
      return res.status(400).json({ msg: "fail to delete" });
    }
    return res.status(201).json({ msg: "delete done" });
  });
};
//================================================
export { getCustomers, addCustomer, updateCustomer, deleteCustomer, login };
