const uuid = require('uuid');
const path = require('path');
const { Op } = require("sequelize");
const { Profession } = require('../models/models');
const ApiError = require('../error/ApiError');
const fs = require('fs');


class ProfessionController {

    async create(req, res) {
        const file = path.resolve(__dirname, './data.json')
        
        fs.readFile(file, 'utf8', async function (err, data) {
            if (err) throw err;
            const obj = JSON.parse(data);

            obj.map(item => {
              
                const job = Profession.create({
                   id: item.id,
                   profession: item.profession,
                   createdAt: item.createdAt,
                   updatedAt: item.updatedAt
                });
                
            })
     
        });

    }

    async getAll(req, res) {

        const { value } = req.query;
        const val = value.toLowerCase();
        const professions = await Profession.findAll({
            where: {
                profession: { [Op.like]: '%' + val + '%' }
            }
        });
        console.log(professions);


        return res.json(professions);
    }
}

module.exports = new ProfessionController();

