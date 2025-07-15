module.exports = (sequelize, DataTypes) => {

    const SavedFonts = sequelize.define("SavedFonts", {
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return SavedFonts
}