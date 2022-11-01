const uuid = require('uuid');
const path = require('path');
const { Op } = require("sequelize");
const {Profession} = require('../models/models');
const ApiError = require('../error/ApiError');
const sequelize = require('sequelize');


class ProfessionController {
    
    async getAll(req, res) {

        const {value} = req.query;
        const val = value.toLowerCase();
        const professions = await Profession.findAll({
            where: {
                profession: { [Op.like]: '%' + val + '%'}
            }
        });

        return res.json(professions);
    }
}

module.exports = new ProfessionController();

// COPY professions
// FROM 'D:\prof.csv'
// DELIMITER ';'
// CSV HEADER ENCODING 'windows-1251';