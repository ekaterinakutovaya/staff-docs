const uuid = require('uuid');
const path = require('path');
const { Op } = require("sequelize");
const { Company, Employee, Contract, Order } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
    async create(req, res, next) {
        try {
            const { values, orderTypeId, employeeId, companyId, contractId, agreementId } = req.body;
            const { orderNo, orderDate } = values;

            const order = await Order.create({ orderNo, orderDate, orderTypeId, companyId, employeeId, contractId, agreementId });

            return res.json(order);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }

    }

    async getAll(req, res) {
        const { companyId } = req.query;
        const orders = await Order.findAll({
            where: { companyId: Number(companyId) },
            order: [['orderNo', 'ASC']] 
        })

        return res.json(orders);
    }

    async edit(req, res, next) {
        const { values: { orderNo, orderDate }, orderId, contractId, employeeId } = req.body;

        try {
            await Order.update(
                {
                    orderNo, orderDate, contractId, employeeId
                },
                { where: { id: orderId } }
            )

            return res.status(200).send({ message: 'The order has been updated' });
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async editDismissal(req, res, next) {
        const { values: { orderNo, orderDate, dismissalDate, groundsForDismissal, compensationDays, averageSalary }, orderId } = req.body;

        try {
            await Order.update(
                {
                    orderNo, orderDate, dismissalDate, groundsForDismissal, compensationDays, averageSalary
                },
                { where: { id: orderId } }
            )

            return res.status(200).send({ message: 'The order has been updated' });
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        const { orderId } = req.body;
        console.log(req.body);
        
        Order.destroy({ where: { id: Number(orderId) } })
            .then(num => {
                if (num === 1) {
                    return res.json(orderId);
                } else {
                    res.send({ message: `Cannot delete Order with id=${orderId}` });
                }
            })
            .catch(err => {
                res.status(500).send({ message: `Cannot delete Order with id=${orderId}` });
            })
    }

    async createDismissal(req, res, next) {
        const { values, orderTypeId, employeeId, contractId, companyId } = req.body;
        const { orderNo, orderDate, dismissalDate, groundsForDismissal, compensationDays, averageSalary } = values;

        try {
            
            const order = await Order.create({ orderNo, orderDate, orderTypeId, dismissalDate, groundsForDismissal, compensationDays, averageSalary, companyId, employeeId, contractId });

            return res.json(order);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }

    }
}

module.exports = new OrderController();