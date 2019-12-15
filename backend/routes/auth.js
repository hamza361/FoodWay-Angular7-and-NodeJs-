const express = require('express');
const router  = express.Router();
const auth_routes = require('../controllers/auth');
const checkAuth = require('../middleware/check-auth');

router.post('/phone_verification_part_1',auth_routes.phoneVerificationPart1);
router.post('/phone_verification_part_2',auth_routes.phoneVerificationPart2);
router.get('/hope',auth_routes.getContact);
router.post('/SignUp',auth_routes.SignUp);
router.post('/SignIn',auth_routes.SignIn);
router.get('/get_user',checkAuth,auth_routes.getUser);
router.patch('/update_user',checkAuth,auth_routes.updateUser);
router.patch('/reset_password_pt1',auth_routes.resetPasswordPt1);
router.patch('/reset_password_pt2',auth_routes.resetPasswordPt2);
// router.get('/signin');


module.exports = router;