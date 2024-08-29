module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bulbCount: {
            type: DataTypes.INTEGER
        },
        bulbStatus: {
            type: DataTypes.STRING
        },
        language: {
            type: DataTypes.INTEGER
        },
        theme: {
            type: DataTypes.INTEGER
        },
        lastBg: {
            type: DataTypes.STRING
        },
        lastFont: {
            type: DataTypes.STRING
        }
    });

    return Users
}