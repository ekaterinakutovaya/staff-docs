const Router = require('express');
const router = new Router();
const additionalAgreementController = require('../controllers/additionalAgreementController');

router.post('/create', additionalAgreementController.create);
router.get('/', additionalAgreementController.getAll);
router.post('/edit', additionalAgreementController.edit);
router.post('/delete', additionalAgreementController.delete);
// router.post('/cancel', contractController.cancel);

module.exports = router;