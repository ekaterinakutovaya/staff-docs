const moment = require('moment');
const Morpher = require('morpher-ws3-client');
const morpher = new Morpher();
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const ApiError = require('../error/ApiError');

const dateFormatter = (date) => {
    date = moment(date);
    date = date.format('DD.MM.YYYY');
    return date;
}

const wordDecliner = async (word) => {
    const response = await morpher.russian.declension(word.toLowerCase());
    return response['родительный'];
}

const numberWordDecliner = async (number) => {
    const response = await morpher.russian.spell(number, 'день');
    return response.unit.accusative;
}

const currencyDecliner = async (number) => {
    const response = await morpher.russian.spell(number, 'сум');
    return response.unit.accusative;
}

const amountInWordsDecliner = async (number) => {
    const response = await morpher.russian.spell(number, 'сум');
    return response.n.accusative;
}

const generateWordFile = async ({ template, dataToAdd, output}) => {
    const templateDocFile = fs.readFileSync(path.resolve(__dirname, template), 'binary');
    const zip = new PizZip(templateDocFile);

        let outputDocument = new Docxtemplater(zip);
        outputDocument.setData(dataToAdd);

        try {
            outputDocument.render()
            let outputDocumentBuffer = outputDocument.getZip().generate({ type: 'nodebuffer' });
            fs.writeFileSync(path.resolve(__dirname, output), outputDocumentBuffer);
        }
        catch (error) {
            console.error(`ERROR Filling out Template`);
            console.error(error)
        }
}

const calculateCompensation = (compensationDays, averageSalary) => {
    const compensation = (averageSalary / 25.4) * compensationDays;
    return compensation;
}

module.exports = {
    dateFormatter,
    wordDecliner,
    numberWordDecliner,
    currencyDecliner,
    amountInWordsDecliner,
    generateWordFile,
    calculateCompensation
}
