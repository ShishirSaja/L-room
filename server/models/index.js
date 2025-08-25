const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./User.js')(sequelize, Sequelize);
db.Classroom = require('./Classroom.js')(sequelize, Sequelize);
db.Document = require('./Document.js')(sequelize, Sequelize);
db.Topic = require('./Topic.js')(sequelize, Sequelize);

// Define associations
db.User.hasMany(db.Classroom, { as: "classrooms", foreignKey: "userId" });
db.Classroom.belongsTo(db.User, { as: "lecturer", foreignKey: "userId" });

db.Classroom.hasMany(db.Document, { as: "documents", foreignKey: "classroomId" });
db.Document.belongsTo(db.Classroom, { as: "classroom", foreignKey: "classroomId" });

db.Document.hasMany(db.Topic, { as: "topics", foreignKey: "documentId" });
db.Topic.belongsTo(db.Document, { as: "document", foreignKey: "documentId" });

module.exports = db;