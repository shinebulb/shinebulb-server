module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
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