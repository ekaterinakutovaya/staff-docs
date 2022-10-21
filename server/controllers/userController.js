const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/models')


class UserController {
    async auth(req, res, next) {
        console.log(req);
        
        const { given_name, picture, sub } = req.body;

        const user = await User.findOne({ where: { sub } });
        if (user) {
            return res.status(200).json({ sub, picture });
        }

        await User.create({ sub, given_name, picture });
        return res.status(201).json({ sub, picture });
    }

    // async getOne(req, res) {
    //     const {sub} = req.params;
    //     const user = await User.findOne(
    //         {
    //             where: {sub}
    //         }
    //     )
    //     return res.json(user);
    // }
}

module.exports = new UserController();