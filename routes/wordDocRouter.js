const Router = require('express');
const router = new Router();
const wordDocController = require('../controllers/wordDocController');

router.post('/generate_contract', wordDocController.generateContract);
router.post('/generate_agreement', wordDocController.generateAdditionalAgreement);
router.post('/generate_contract_cancellation', wordDocController.generateContractCancellation);
router.post('/generate_order', wordDocController.generateOrder);
router.post('/generate_staff_chages_order', wordDocController.generateStaffChangesOrder);
router.post('/generate_dismissal_order', wordDocController.generateDismissalOrder);
router.get('/download', wordDocController.download);

module.exports = router;