const Router = require('express');
const router = new Router();
const companyController = require('../controllers/companyController');

router.post('/create', companyController.create);
router.get('/', companyController.getAll);
router.post('/set_current', companyController.setCurrent);
router.get('/details', companyController.getDetails);
router.post('/create_details', companyController.createCompanyDetails);
router.post('/delete_company', companyController.deleteOneCompany);
router.post('/edit_company_details', companyController.editCompanyDetails);
router.post('/delete_company_details', companyController.deleteCompanyDetails);
// router.post('/:id', companyController.getOne);

module.exports = router;