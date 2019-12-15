const express = require('express');
const router  = express.Router();
const exclusive_discounted_deals_controller = require('../controllers/exclusive-discounted-deals');
const checkAuth = require('../middleware/check-auth');

router.get('/get-products',checkAuth,exclusive_discounted_deals_controller.getProducts);
router.post('/add-product',checkAuth,exclusive_discounted_deals_controller.addProduct);
router.delete('/delete-product/:_id',checkAuth,exclusive_discounted_deals_controller.deleteProduct);
router.get('/get-product/:_id',checkAuth,exclusive_discounted_deals_controller.getProduct);
router.patch('/edit-product',checkAuth,exclusive_discounted_deals_controller.editProduct);

module.exports = router;