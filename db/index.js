import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
    logQueryParameters: true,
    benchmark: true
})

export const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  surname: DataTypes.STRING,
  dni: DataTypes.INTEGER,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  carrer: DataTypes.STRING,
});

export const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  surname: DataTypes.STRING,
  dni: DataTypes.INTEGER,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
});

export const Absence = sequelize.define('Absence', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: DataTypes.DATE,
  justified: DataTypes.BOOLEAN,
});

export const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  instance: DataTypes.STRING,
  grade: DataTypes.INTEGER,
});

export const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  carrer: DataTypes.STRING,
  duration: DataTypes.INTEGER,
  schedule: DataTypes.STRING,
});

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

await sequelize.sync()