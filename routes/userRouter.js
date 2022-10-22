const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');

router.post('/auth', userController.auth);

module.exports = router;