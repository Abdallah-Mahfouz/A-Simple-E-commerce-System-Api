import { Router } from "express";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  login,
} from "./customers.controller.js";
import { emailExist } from "../../middleware/emailExist.js";

const router = Router();

router.get("/", getCustomers);
router.post("/", emailExist, addCustomer);
router.post("/login", login);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
