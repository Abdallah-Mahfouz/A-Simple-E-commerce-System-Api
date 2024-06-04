import connection from "../../db/models/connectionDB.js";



const emailExist = (req, res, next) => {
    const {email} = req.body
  connection.execute(
    `select email from customer where email="${email}"`,
    (err, result) => {
      if (err) {
        return res.status(400).json({ msg: "query failed", err });
      }
      if (result.length) {
        return res.status(400).json({ msg: "customer already exists" });
      }
      next()
    }
  );
};


export{emailExist}