const uuid = require('uuid');
const path = require('path');
const { Op } = require("sequelize");
const { Company, Employee, Contract, Order, AdditionalAgreement } = require('../models/models');
const ApiError = require('../error/ApiError');

class AdditionalAgreementController {
    async create(req, res, next) {
        const { values, agreementNo, companyId, employeeId, contractId, prevAgreementId } = req.body;
        const { agreementDate, position, salary, salaryRate, workHours, workHoursStart, workHoursEnd, workSchedule } = values;
        console.log(agreementDate);


        try {
            const agreement = await AdditionalAgreement.create({
                agreementNo, agreementDate, position, salary, salaryRate, workHours, workHoursStart, workHoursEnd, workSchedule, employeeId, companyId, contractId, prevAgreementId
            });

            return res.json(agreement);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }

    }

    async getAll(req, res) {
        const { companyId } = req.query;
        console.log(req.query);

        const agreements = await AdditionalAgreement.findAll({ where: { companyId: Number(companyId) } })

        if (agreements) {
            return res.json(agreements);
        } else {
            return res.json([]);
        }
        

    }

    async edit(req, res, next) {
        const { values: { agreementDate, position, salary, salaryRate, workHoursStart, workHoursEnd, workSchedule, }, agreementId } = req.body;

        try {
            await AdditionalAgreement.update(
                {
                    agreementDate, position, salary, salaryRate, workHoursStart, workHoursEnd, workSchedule
                },
                { where: { id: agreementId } }
            )

            return res.status(200).send({ message: 'The additional agreement has been updated' });
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        const { agreementId } = req.body;

        AdditionalAgreement.destroy({ where: { id: agreementId } })
            .then(num => {
                if (num === 1) {
                    return res.json(agreementId);
                } else {
                    res.send({ message: `Cannot delete Additional agreement with id=${agreementId}` });
                }
            })
            .catch(err => {
                res.status(500).send({ message: `Cannot delete Additional agreement with id=${agreementId}` });
            })
    }
}

module.exports = new AdditionalAgreementController();