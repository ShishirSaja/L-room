module.exports = (sequelize, DataTypes) => {
    const Document = sequelize.define("Document", {
        fileName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });
    return Document;
};