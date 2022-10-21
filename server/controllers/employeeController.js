const uuid = require('uuid');
const path = require('path');
const { Op } = require("sequelize");
const { Company, Employee } = require('../models/models');
const ApiError = require('../error/ApiError');

class EmployeeController {
    async create(req, res, next) {
        
        try {
            const { values: { employeeFamilyName, employeeFirstName, employeePatronymic, personalId, employeeINN, passportSeries, passportNo, issueAuthority, issueDate, employeeAddress, employeePhoneNumber }, companyId } = req.body;
            // console.log(typeof companyId);


            const employee = await Employee.create({ employeeFamilyName, employeeFirstName, employeePatronymic, personalId, employeeINN, passportSeries, passportNo, issueAuthority, issueDate, employeeAddress, employeePhoneNumber, companyId });

            return res.json(employee);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }

    }

    async getAll(req, res) {
        const { companyId } = req.query;
        console.log(`myQuery: ${req}`);
        
        const employees = await Employee.findAll({
            where: { companyId: Number(companyId) },
            order: [['employeeFamilyName', 'ASC']]
        })

        return res.json(employees);
    }

    async edit(req, res, next) {
        try {
            const { values: { employeeFamilyName, employeeFirstName, employeePatronymic, personalId, employeeINN, passportSeries, passportNo, issueAuthority, issueDate, employeeAddress, employeePhoneNumber }, id } = req.body;

            const updatedEmployee = await Employee.update(
                {
                    employeeFamilyName, employeeFirstName, employeePatronymic, personalId, employeeINN, passportSeries, passportNo, issueAuthority, issueDate, employeeAddress, employeePhoneNumber
                },
                { where: { id: id } }
            )

            return res.json(updatedEmployee);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }


    async setEmployed(req, res, next) {
        try {
            const { employeeId } = req.body;

            const updatedEmployee = await Employee.update(
                {
                    isEmployed: true
                },
                { where: { id: employeeId } }
            )

            return res.json(employeeId);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        const { id } = req.body;

        Employee.destroy({ where: { id: id } })
            .then(num => {
                if (num === 1) {
                    return res.json(id);
                } 
                // else {
                //     res.json(id);
                // }
            })
            .catch(err => {
                res.status(500).send({ message: `Невозможно удалить физ.лицо, имеются связанные документы.` })
                // res.json(id);
                // res.status(500).send(id)
            })
    }
}

module.exports = new EmployeeController();