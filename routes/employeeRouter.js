const Router = require('express');
const router = new Router();
const employeeController = require('../controllers/employeeController');

router.post('/create', employeeController.create);
router.get('/', employeeController.getAll);
router.post('/edit', employeeController.edit);
router.post('/set_employed', employeeController.setEmployed);
router.post('/delete', employeeController.delete);

module.exports = router;