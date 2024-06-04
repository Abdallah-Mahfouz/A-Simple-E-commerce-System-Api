import { Router } from "express";
import { addProducts, getProducts, getTotalItemsSoldByProduct, getTotalRevenueByCategory } from "./product.controller.js";


const router=Router();

router.get('/',getProducts)
router.get('/revenue',getTotalRevenueByCategory)
router.get('/ItemsSold',getTotalItemsSoldByProduct)
router.post('/',addProducts)

export default router;