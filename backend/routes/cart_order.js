const express = require('express');
const router = express.Router();
const cart_order = require('../controllers/cart_order');
const checkAuth = require('../middleware/check-auth');
const user_location = require('../middleware/user_location');
router.post('/add_to_cart',checkAuth,cart_order.postCart);
router.get('/getCart',checkAuth,cart_order.getCart);
router.post('/deleteFromCart',checkAuth,cart_order.postCartDelete);
router.post('/order',checkAuth,user_location,cart_order.postOrder);
router.get('/user_orders',checkAuth,cart_order.getUserOrders);
router.get('/admin_orders',checkAuth,cart_order.getAdminOrders);
router.patch('/order_accepted',checkAuth,cart_order.patchOrderAcceptd);
router.patch('/delivery_started',checkAuth,cart_order.patchDeliveryStarted);
router.patch('/order_delivered',checkAuth,cart_order.patchOrderDelivered);

module.exports = router;