const conn = require('./conn');
const { UUID, UUIDV4, DECIMAL, STRING, BOOLEAN } = conn.Sequelize;

const Entry = conn.define('entry', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    volume: {
        type: DECIMAL(10, 2),
        validate: {
            isDecimal: true,
            notEmpty: true
        },
        defaultValue: 0.00
    },
    price: {
        type: DECIMAL(10, 2),
        validate: {
            isDecimal: true,
            notEmpty: true
        }
    },
    btc: {
        type: DECIMAL(10, 8),
        get() {
            return (this.volume / this.price).toFixed(8);
        }
    },
    soldBtc: {
        type: DECIMAL(10, 8)
    },
    isSale: {
        type: BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
});

module.exports = Entry;