module.exports = (sequelize, DataTypes) => {

    const SavedThemes = sequelize.define("SavedThemes", {
        bg: {
            type: DataTypes.STRING,
            allowNull: false
        },
        font: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return SavedThemes
}