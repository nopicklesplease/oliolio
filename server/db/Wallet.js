const conn = require('./conn');
const { STRING, UUID, UUIDV4 } = conn.Sequelize;

const Wallet = conn.define('wallet', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING,
        validate: {
            notEmpty: true
        },
        allowNull: false
    }
})

module.exports = Wallet;