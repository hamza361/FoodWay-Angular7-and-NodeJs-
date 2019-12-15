const express = require('express');
const router = express.Router();
const pizza_controller = require('../controllers/pizza');
const checkAuth = require('../middleware/check-auth');
router.get('/get-products',checkAuth,pizza_controller.getProducts);
router.post('/add-product',checkAuth,pizza_controller.addProduct);
router.delete('/delete-product/:_id',checkAuth,pizza_controller.deleteProduct);
router.get('/get-product/:_id',checkAuth,pizza_controller.getProduct);
router.patch('/edit-product',checkAuth,pizza_controller.editProduct);

module.exports = router;