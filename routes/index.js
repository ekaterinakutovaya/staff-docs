const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const companyRouter = require('./companyRouter');
const employeeRouter = require('./employeeRouter');
const contractRouter = require('./contractRouter');
const professionRouter = require('./professionRouter');
const additionalAgreementRouter = require('./additionalAgreementRouter');
const orderRouter = require('./orderRouter');
const wordDocRouter = require('./wordDocRouter');

router.use('/user', userRouter);
router.use('/company', companyRouter);
router.use('/employee', employeeRouter);
router.use('/profession', professionRouter);
router.use('/contract', contractRouter);
router.use('/additional_agreement', additionalAgreementRouter);
router.use('/order', orderRouter);
router.use('/word', wordDocRouter);

module.exports = router;