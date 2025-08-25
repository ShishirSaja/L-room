module.exports = (sequelize, DataTypes) => {
    const Topic = sequelize.define("Topic", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Topic;
};