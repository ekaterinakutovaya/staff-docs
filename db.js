const {Sequelize} = require('sequelize');

// module.exports = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         dialect: 'postgres',
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT
//     }
// )

module.exports = new Sequelize('postgresql://postgres:dZkKiT8gaM82OMb3ds3V@containers-us-west-95.railway.app:7931/railway', {
    define: {
        timestamps: true
    }
})
