module.exports = (sequelize, DataTypes) => {
    const Classroom = sequelize.define("Classroom", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Classroom;
};