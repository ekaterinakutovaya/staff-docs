const Router = require('express');
const router = new Router();
const contractController = require('../controllers/contractController');

router.post('/create', contractController.create);
router.get('/', contractController.getAll);
router.post('/edit', contractController.edit);
router.post('/delete', contractController.delete);
router.post('/cancel', contractController.cancel);
router.post('/cancel_dismissal', contractController.cancelDismissal);

module.exports = router;