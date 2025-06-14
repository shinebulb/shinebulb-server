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
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        emailToken: {
            type: DataTypes.STRING
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
        },
        invertTheme: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        font: {
            type: DataTypes.STRING,
            allowNull: true
        },
    });

    return Users
}