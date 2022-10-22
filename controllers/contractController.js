const uuid = require('uuid');
const path = require('path');
const { Op } = require("sequelize");
const { Company, Employee, Contract, Order } = require('../models/models');
const ApiError = require('../error/ApiError');

class ContractController {
    async create(req, res, next) {
        try {
            const { values, companyId, employeeId } = req.body;
            const { contractNo, contractDate, position, salary, salaryRate, workHours, workHoursStart, workHoursEnd, workSchedule, vacationDays } = values;

            const contract = await Contract.create({
                contractNo,
                contractDate,
                position,
                salary,
                salaryRate,
                workHours,
                workHoursStart,
                workHoursEnd,
                workSchedule,
                vacationDays, companyId, employeeId
            });

            Employee.update({ isEmployed: true}, { where: { id: employeeId } })

            return res.json(contract);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }

    }

    async getAll(req, res) {
        const { companyId } = req.query;
        const contracts = await Contract.findAll({ where: { companyId: Number(companyId) } })

        return res.json(contracts);

    }

    async edit(req, res, next) {
        const { values: { contractNo, contractDate, position, salary, salaryRate, workHours, workHoursStart, workHoursEnd, workSchedule, vacationDays }, contractId, employeeId } = req.body;
        
        try {
            await Contract.update(
                {
                    contractNo, contractDate, position, salary, salaryRate, workHours, workHoursStart, workHoursEnd, workSchedule, vacationDays, employeeId
                },
                { where: { id: contractId } }
            )

            return res.status(200).send({message: 'The contract has been updated'});
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        const { contractId } = req.body;

        // const employeeId = await Employee.findOne({where: {id: }})

        Contract.destroy({ where: { id: contractId } })
            .then(num => {
                if (num === 1) {
                    return res.json(contractId);
                } else {
                    res.send({ message: `Cannot delete Contract with id=${contractId}` });
                }
            })
            .catch(err => {
                res.status(500).send({ message: `Cannot delete Contract with id=${contractId}` });
            })
    }

    async cancel(req, res, next) {
        const { dismissalDate, employeeId } = req.body;
        
        const contract = await Contract.findOne({ where: { employeeId: employeeId } });
        Employee.update({ isEmployed: false }, { where: { id: employeeId }});

        try {
            await Contract.update(
                {
                    dismissalDate
                },
                { where: { id: contract.id } }
            )

            Employee.update({ isEmployed: false }, { where: { id: employeeId } });

            return res.status(200).json(contract.id).send({ message: 'The contract has been cancelled' });
        } catch (error) {
            // next(ApiError.badRequest(error.message));
            return res.status(404);
        }
    }

    async cancelDismissal(req, res, next) {
        const { contractId } = req.body;
        
        try {
            const contract = await Contract.update(
                {
                    dismissalDate: null
                },
                { where: { id: contractId } }
            )

            // console.log(contract);
            return res.status(200).json(contractId).send({ message: 'The contract has been restored' });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}

module.exports = new ContractController();