const uuid = require('uuid');
const path = require('path');
const { Op } = require("sequelize");
const { Profession } = require('../models/models');
const ApiError = require('../error/ApiError');
// const sequelize = require('sequelize');
const Sequelize = require('../db');
const fs = require('fs');
const parse = require('csv-parse')
const CsvReadableStream = require('csv-reader');
const dbMod = require('csv-sequelize');

class ProfessionController {

    async create(req, res) {
        const myPath = path.resolve(__dirname, 'prof.csv');
        const jobs = await Sequelize.query(`COPY professions FROM ${myPath} DELIMITER ';' CSV HEADER ENCODING 'windows-1251'`, {
            model: Profession
        })
        console.log(myPath);



        // const data = [];
        // let inputStream = fs.createReadStream('../prof.csv', 'utf-8');

        // inputStream
        //     .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        //     .on('data', function (row) {
        //         // console.log('Row: ', row);
        //         data.push(row);
        //     })
        //     .on('end', function () {
        //         console.log(data);
        //     });



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

// COPY professions
// FROM 'D:\prof.csv'
// DELIMITER ';'
// CSV HEADER ENCODING 'windows-1251';