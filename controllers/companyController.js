const uuid = require('uuid');
const path = require('path');
const { Op } = require("sequelize");
const {Company, CompanyDetails, User} = require('../models/models');
const ApiError = require('../error/ApiError');


class CompanyController {
    async create(req, res, next) {

        try {
            const { values: { companyName, address, phoneNumber, registerDate, companyINN, bankAccount, bankName, bankCode, companyOKED, manager }, sub } = req.body;
            const user = await User.findOne({ where: { sub } });

            const companies = await Company.findAll({ where: { userId: user.id } })
            let company;
            
            if (companies.length > 0) {
                company = await Company.create({ companyName, companyinn: companyINN, isCurrent: false, userId: user.id });
            } else {
                company = await Company.create({ companyName, companyinn: companyINN, isCurrent: true, userId: user.id });
            }
            

            // const company = await Company.create({ companyName, isCurrent: false, userId: user.id });

            const companyDetails = await CompanyDetails.create({ companyName, address, phoneNumber, registerDate, companyINN, bankAccount, bankName, bankCode, companyOKED, manager, companyId: company.id })

            return res.json(company);
            
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
        
    }

    async getAll(req, res) {
        const {sub} = req.query;
        // console.log(req.query)
        const user = await User.findOne({ where: { sub: sub } });
        const companies = await Company.findAll({
            where: {userId: user.id},
            order: [['createdAt', 'ASC']]
        });
        
        return res.json(companies);
    }

    async setCurrent(req, res) {
        const { companyId, sub} = req.body;
        // console.log(companyId);
        
        const currentCompany = await Company.findOne({ where: { id: companyId } });
               
        Company.update(
            {isCurrent: true},
            { where: { id: +companyId }}
        )
        Company.update(
            { isCurrent: false },
            {
                where: {
                    userId: {
                        [Op.eq]: currentCompany.userId
                    },
                    id: {
                        [Op.not]: +companyId
                    }
                } }
        )

        return res.json(currentCompany);
    }

    async getDetails(req, res) {
        const { companyId } = req.query;
        const details = await CompanyDetails.findAll({
            where: { companyId: +companyId },
            order: [['registerDate', 'ASC']]
        });

        return res.json(details);
    }

    async insertCompanyChanges(req, res) {
        const { values: { companyName, address, phoneNumber, registerDate, companyINN, bankAccount, bankName, bankCode, companyOKED, manager }, companyId } = req.body;        

        const companyDetails = await CompanyDetails.create({ companyName, address, phoneNumber, registerDate, companyINN, bankAccount, bankName, bankCode, companyOKED, manager, companyId: +companyId });

        return res.json(companyDetails);  
    }

    async deleteOneCompany(req, res) {
        const { id } = req.body;
        Company.destroy({where: {id: +id}})
            .then(num => {
                if (num === 1) {
                    return res.json(+id);
                } else {
                    res.send({message: `Cannot delete Company with id=${id}`});
                }
            })
            .catch(err => {
                res.status(500).send({ message: `Cannot delete Company with id=${id}` })
            })
    }

    async editCompanyDetails(req, res) {
        const { values: { companyName, address, phoneNumber, registerDate, companyINN, bankAccount, bankName, bankCode, companyOKED, manager }, id } = req.body;

        const updatedDetails = await CompanyDetails.update(
            { 
                companyName: companyName,
                registerDate: registerDate,
                address: address,
                phoneNumber: phoneNumber,
                bankAccount: bankAccount,
                bankName: bankName,
                bankCode: bankCode,
                companyINN: companyINN,
                companyOKED: companyOKED,
                manager: manager
            },
            { where: { id: id } }
        )
        
        return res.json(updatedDetails);
    }

    async deleteCompanyDetails(req, res) {
        const {id} = req.body;
        console.log(typeof id);
        

        CompanyDetails.destroy({ where: { id: Number(id) } })
            .then(num => {
                if (num === 1) {
                    return res.json(+id);
                } else {
                    res.send({ message: `Cannot delete Company with id=${id}` });
                }
            })
            .catch(err => {
                res.status(500).send({ message: `Cannot delete Company with id=${id}` })
            })
    }
}

module.exports = new CompanyController();