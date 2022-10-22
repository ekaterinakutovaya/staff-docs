const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');

router.post('/create', orderController.create);
router.post('/create_dismissal', orderController.createDismissal);
router.get('/', orderController.getAll);
router.post('/edit', orderController.edit);
router.post('/edit_dismissal', orderController.editDismissal);
router.post('/delete', orderController.delete);

// router.post('/:id', companyController.getOne);

module.exports = router;