const fs = require('fs');
const path = require('path');
const moment = require('moment');
const ApiError = require('../error/ApiError');
const { Company, CompanyDetails, Employee, Contract, Order, AdditionalAgreement } = require('../models/models');
const { dateFormatter, wordDecliner, generateWordFile, calculateCompensation, numberWordDecliner, currencyDecliner, amountInWordsDecliner } = require('../utils/utils');

class wordDocController {
    async generateContract(req, res, next) {
        const { contractId } = req.body;

        const contract = await Contract.findByPk(contractId);
        const { contractNo, contractDate, position, salary, salaryRate, workHoursStart, workHoursEnd, workSchedule, vacationDays, employeeId, companyId } = contract;
        
        let workHours;
        if (salaryRate < 1) {
            workHours = (workHoursEnd - workHoursStart);
        } else {
            workHours = (workHoursEnd - workHoursStart) - 1;
        }

        const allCompanyDetails = await CompanyDetails.findAll({where: {companyId}});
        
        let companyDetailsId;
        // find actual details
        allCompanyDetails.forEach((details) => {
            if (moment(details.registerDate).isBefore(contractDate, 'day') || moment(details.registerDate).isSame(contractDate, 'day')) {
                companyDetailsId = details.id;
            }
        })

        const companyDetailsById = await CompanyDetails.findByPk(companyDetailsId);
        const { companyName, address, phoneNumber, bankAccount, bankName, bankCode, companyINN, companyOKED, manager } = companyDetailsById;

        const { employeeFamilyName, employeeFirstName, employeePatronymic, passportSeries, passportNo, issueAuthority, issueDate, employeeAddress, employeePhoneNumber, personalId } = await Employee.findByPk(employeeId);

        let employeeName = `${employeeFamilyName} ${employeeFirstName} ${employeePatronymic}`;
        let salaryFormatted = salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        const dataToAdd = {
            contractNo,
            contractDate: dateFormatter(contractDate),
            companyName,
            manager,
            employeeName,
            position: await wordDecliner(position),
            // position,
            salary: salaryFormatted,
            workHours,
            workHoursStart,
            workHoursEnd,
            workSchedule,
            vacationDays,
            address,
            bankAccount,
            bankName,
            bankCode,
            companyINN,
            companyOKED,
            phoneNumber,
            passportSeries,
            passportNo,
            issueAuthority,
            issueDate: dateFormatter(issueDate),
            employeeAddress,
            employeePhoneNumber,
            personalId
        };        

        const template = '../assets/labour_contract_template.docx';
        const output = `../assets/ouput/${employeeName}_трудовой договор от_${dateFormatter(contractDate)}.docx`;
        const fileName = `${employeeName}_трудовой договор от_${dateFormatter(contractDate)}.docx`;

        try {
            await generateWordFile({ template, dataToAdd, output });
            return res.status(200).json({ output, fileName });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }

    }

    async generateContractCancellation(req, res, next) {
        const { contractId } = req.body;

        const contract = await Contract.findByPk(contractId);
        const { contractNo, contractDate, dismissalDate, employeeId, companyId } = contract;

        const allCompanyDetails = await CompanyDetails.findAll({where: {companyId}});
        
        let companyDetailsId;
        allCompanyDetails.forEach((details) => {
            if (moment(details.registerDate).isBefore(dismissalDate, 'day') || moment(details.registerDate).isSame(dismissalDate, 'day')) {
                companyDetailsId = details.id;
            }
        })

        const companyDetailsById = await CompanyDetails.findByPk(companyDetailsId);
        const { companyName, address, phoneNumber, bankAccount, bankName, bankCode, companyINN, companyOKED, manager } = companyDetailsById;

        const { employeeFamilyName, employeeFirstName, employeePatronymic, passportSeries, passportNo, issueAuthority, issueDate, employeeAddress, employeePhoneNumber, personalId } = await Employee.findByPk(employeeId);

        let employeeName = `${employeeFamilyName} ${employeeFirstName} ${employeePatronymic}`;

        const dataToAdd = {
            contractNo,
            contractDate: dateFormatter(contractDate),
            dismissalDate: dateFormatter(dismissalDate),
            companyName,
            manager,
            employeeName,
            address,
            bankAccount,
            bankName,
            bankCode,
            companyINN,
            companyOKED,
            phoneNumber,
            passportSeries,
            passportNo,
            issueAuthority,
            issueDate: dateFormatter(issueDate),
            employeeAddress,
            employeePhoneNumber,
            personalId
        };        

        const template = '../assets/labour_contract_cancellation_template.docx';
        const output = `../assets/ouput/${employeeName}_Расторжение_трудового договора от_${dateFormatter(dismissalDate)}.docx`;
        const fileName = `${employeeName}_Расторжение_трудового договора от_${dateFormatter(dismissalDate)}.docx`;

        try {
            await generateWordFile({ template, dataToAdd, output });
            return res.status(200).json({ output, fileName });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }

    }

    
    async generateOrder(req, res, next) {
        const {orderId} = req.body;
        
        const { orderNo, orderDate, employeeId, contractId, companyId } = await Order.findByPk(orderId);
        
        const allCompanyDetails = await CompanyDetails.findAll({ where: { companyId } });
        
        let companyDetailsId;
        allCompanyDetails.forEach((details) => {
            if (moment(details.registerDate).isBefore(orderDate, 'day') || moment(details.registerDate).isSame(orderDate, 'day')) {
                companyDetailsId = details.id;
            }
        })
        
        const { companyName, address, phoneNumber, bankAccount, bankName, bankCode, companyINN, manager } = await CompanyDetails.findByPk(companyDetailsId);

        const { employeeFamilyName, employeeFirstName, employeePatronymic } = await Employee.findByPk(employeeId);

        const { contractNo, contractDate, position, salary, salaryRate } = await Contract.findByPk(contractId);
        
        let employeeName = `${employeeFamilyName} ${employeeFirstName} ${employeePatronymic}`;
        let salaryFormatted = salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        let salaryRatePlaceholder;
        if (salaryRate < 1) {
            salaryRatePlaceholder = ` на ${salaryRate} ставки `;
        } else {
            salaryRatePlaceholder = ' ';
        }
        
        const dataToAdd = {
            companyName,
            address,
            bankAccount,
            bankName,
            bankCode,
            companyINN,
            phoneNumber,
            orderNo,
            orderDate: dateFormatter(orderDate),
            employeeName,
            position: await wordDecliner(position),
            salary: salaryFormatted,
            salaryRatePlaceholder,
            contractNo,
            contractDate: dateFormatter(contractDate),
            manager
        }

        const template = '../assets/order_template.docx';
        const output = `../assets/ouput/Приказ_о_приеме_на_работу_№ ${orderNo}_от_${dateFormatter(orderDate)}.docx`;
        const fileName = `Приказ_о_приеме_на_работу_№ ${orderNo}_от_${dateFormatter(orderDate)}.docx`;

        try {
            await generateWordFile({ template, dataToAdd, output });
            return res.status(200).json({ output, fileName });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async generateDismissalOrder(req, res, next) {
        const {orderId} = req.body;
        
        const { orderNo, orderDate, dismissalDate, employeeId, contractId, companyId, groundsForDismissal, compensationDays, averageSalary } = await Order.findByPk(orderId);
        
        const allCompanyDetails = await CompanyDetails.findAll({ where: { companyId } });
        
        let companyDetailsId;
        allCompanyDetails.forEach((details) => {
            if (moment(details.registerDate).isBefore(orderDate, 'day') || moment(details.registerDate).isSame(orderDate, 'day')) {
                companyDetailsId = details.id;
            }
        })
        
        const { companyName, address, phoneNumber, bankAccount, bankName, bankCode, companyINN, manager } = await CompanyDetails.findByPk(companyDetailsId);

        const { employeeFamilyName, employeeFirstName, employeePatronymic } = await Employee.findByPk(employeeId);

        const { contractNo, contractDate } = await Contract.findByPk(contractId);
        
        let employeeName = `${employeeFamilyName} ${employeeFirstName} ${employeePatronymic}`;
        let compensation = calculateCompensation(compensationDays, Number(averageSalary));
        compensation = new Intl.NumberFormat('ru-RU', {maximumFractionDigits: 2}).format(compensation);
        
        
        const dataToAdd = {
            companyName,
            address,
            bankAccount,
            bankName,
            bankCode,
            companyINN,
            phoneNumber,
            orderNo,
            orderDate: dateFormatter(orderDate),
            employeeName,
            contractNo,
            contractDate: dateFormatter(contractDate),
            dismissalDate: dateFormatter(dismissalDate),
            manager,
            compensationDays,
            days: await numberWordDecliner(compensationDays),
            compensation,
            groundsForDismissal
        }

        const template = '../assets/dismissal_order_template.docx';
        const output = `../assets/ouput/Приказ_о_расторжении_№ ${orderNo}_от_${dateFormatter(orderDate)}.docx`;
        const fileName = `Приказ_о_расторжении_№ ${orderNo}_от_${dateFormatter(orderDate)}.docx`;

        try {
            await generateWordFile({ template, dataToAdd, output });
            return res.status(200).json({ output, fileName });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async download(req, res, next) {
        const { fileName } = req.query;

        try {
            const myPath = path.resolve(__dirname, `../assets/ouput/${fileName}`);
            if (fs.existsSync(myPath)) {
                return res.download(myPath, fileName, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    fs.unlinkSync(myPath)
                });
            }
            return res.status(400).json({ message: "Download error" })
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }

    }

    async generateAdditionalAgreement(req, res, next) {
        const { agreementId } = req.body;

        const agreement = await AdditionalAgreement.findByPk(agreementId);
        const { agreementNo, agreementDate, position, salary, salaryRate, workHoursStart, workHoursEnd, workSchedule, employeeId, companyId, contractId } = agreement;

        let workHours;
        if (salaryRate < 1) {
            workHours = (workHoursEnd - workHoursStart);
        } else {
            workHours = (workHoursEnd - workHoursStart) - 1;
        }

        const allCompanyDetails = await CompanyDetails.findAll({ where: { companyId } });

        let companyDetailsId;
        allCompanyDetails.forEach((details) => {
            if (moment(details.registerDate).isBefore(agreementDate, 'day') || moment(details.registerDate).isSame(agreementDate, 'day')) {
                companyDetailsId = details.id;
            }
        })

        const companyDetailsById = await CompanyDetails.findByPk(companyDetailsId);
        const { companyName, address, phoneNumber, bankAccount, bankName, bankCode, companyINN, companyOKED, manager } = companyDetailsById;

        const { employeeFamilyName, employeeFirstName, employeePatronymic, passportSeries, passportNo, issueAuthority, issueDate, employeeAddress, employeePhoneNumber, personalId } = await Employee.findByPk(employeeId);

        const contract = await Contract.findByPk(contractId);
        const { contractNo, contractDate } = contract;

        let employeeName = `${employeeFamilyName} ${employeeFirstName} ${employeePatronymic}`;
        let salaryFormatted = salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        const dataToAdd = {
            agreementNo,
            agreementDate: dateFormatter(agreementDate),
            contractNo,
            contractDate: dateFormatter(contractDate),
            companyName,
            manager,
            employeeName,
            position: await wordDecliner(position),
            // position,
            salary: salaryFormatted,
            workHours,
            workHoursStart,
            workHoursEnd,
            workSchedule,
            address,
            bankAccount,
            bankName,
            bankCode,
            companyINN,
            companyOKED,
            phoneNumber,
            passportSeries,
            passportNo,
            issueAuthority,
            issueDate: dateFormatter(issueDate),
            employeeAddress,
            employeePhoneNumber,
            personalId
        };

        const template = '../assets/additional_agreement_template.docx';
        const output = `../assets/ouput/${employeeName}_Доп.соглашение от_${dateFormatter(agreementDate)}.docx`;
        const fileName = `${employeeName}_Доп.соглашение от_${dateFormatter(agreementDate)}.docx`;

        try {
            await generateWordFile({ template, dataToAdd, output });
            return res.status(200).json({ output, fileName });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }

    }

    async generateStaffChangesOrder(req, res, next) {
        const { orderId } = req.body;

        const { orderNo, orderDate, employeeId, companyId, agreementId } = await Order.findByPk(orderId);

        const allCompanyDetails = await CompanyDetails.findAll({ where: { companyId } });

        let companyDetailsId;
        allCompanyDetails.forEach((details) => {
            if (moment(details.registerDate).isBefore(orderDate, 'day') || moment(details.registerDate).isSame(orderDate, 'day')) {
                companyDetailsId = details.id;
            }
        })

        const { companyName, address, phoneNumber, bankAccount, bankName, bankCode, companyINN, manager } = await CompanyDetails.findByPk(companyDetailsId);

        const { employeeFamilyName, employeeFirstName, employeePatronymic } = await Employee.findByPk(employeeId);

        const { position, salary, salaryRate } = await AdditionalAgreement.findByPk(agreementId);

        let employeeName = `${employeeFamilyName} ${employeeFirstName} ${employeePatronymic}`;
        let salaryFormatted = salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        let salaryRatePlaceholder;
        if (salaryRate < 1) {
            salaryRatePlaceholder = ` на ${salaryRate} ставки `;
        } else {
            salaryRatePlaceholder = ' ';
        }

        const dataToAdd = {
            companyName,
            address,
            bankAccount,
            bankName,
            bankCode,
            companyINN,
            phoneNumber,
            orderNo,
            orderDate: dateFormatter(orderDate),
            employeeName,
            position: await wordDecliner(position),
            salary: salaryFormatted,
            salaryRatePlaceholder,
            manager
        }

        const template = '../assets/staff_changes_order_template.docx';
        const output = `../assets/ouput/Приказ_о_кадровом перемещении_№ ${orderNo}_от_${dateFormatter(orderDate)}.docx`;
        const fileName = `Приказ_о_кадровом перемещении_№ ${orderNo}_от_${dateFormatter(orderDate)}.docx`;

        try {
            await generateWordFile({ template, dataToAdd, output });
            return res.status(200).json({ output, fileName });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

}

module.exports = new wordDocController();