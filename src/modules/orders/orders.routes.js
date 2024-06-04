import { Router } from "express";
import {
  createOrder,
  getAverageOrderValue,
  getCustomerWithEarliestOrder,
  getCustomersWithAtLeastFiveOrders,
  getCustomersWithNoOrders,
  getOrders,
  getPercentageOfMultipleOrderCustomers,
  getTopCustomer,
  getTopSpendingCustomers,
} from "./orders.controller.js";

const router = Router();

router.get("/", getOrders);
router.get("/averageOrder", getAverageOrderValue);
router.get("/customersWith-No-order", getCustomersWithNoOrders);
router.get("/TopCustomer", getTopCustomer);
router.get("/TopSpendingCustomers", getTopSpendingCustomers);
router.get(
  "/CustomersWithAtLeastFiveOrders",
  getCustomersWithAtLeastFiveOrders
);
router.get(
  "/PercentageOfMultipleOrderCustomers",
  getPercentageOfMultipleOrderCustomers
);
router.get("/CustomerWithEarliestOrder", getCustomerWithEarliestOrder);
router.post("/", createOrder);

export default router;
