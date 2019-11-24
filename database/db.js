const Sequelize = require("sequelize")
const db = {}
var config = require("../config/config.js")

const sequelize = new Sequelize(
    config.databaseName, config.databaseUser, config.databasePassword,
    {
        host: config.host,
        dialect: 'mysql',
        operatorsAliases: false,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
)

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db