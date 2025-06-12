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
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  dni: { type: DataTypes.INTEGER, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  career: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

export const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  dni: { type: DataTypes.INTEGER, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

export const Absence = sequelize.define('Absence', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: { type: DataTypes.DATE, allowNull: false },
  justified: { type: DataTypes.BOOLEAN, allowNull: false },
});

export const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  instance: { type: DataTypes.STRING, allowNull: false },
  grade: { type: DataTypes.INTEGER, allowNull: false },
});

export const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

export const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  career: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  schedule: { type: DataTypes.STRING, allowNull: false },
});

Student.belongsToMany(Subject, { through: "Enrollment", foreignKey: { name: "studentID", allowNull: false }, as: "enrollments" })
Subject.belongsToMany(Student, { through: "Enrollment", foreignKey: { name: "subjectID", allowNull: false }, as: "enrollments" })
// Student.belongsToMany(Subject, { through: "Absence", foreignKey: { name: "studentID", allowNull: false }, as: "absences" })
// Subject.belongsToMany(Student, { through: "Absence", foreignKey: { name: "subjectID", allowNull: false }, as: "absences" })
// Student.belongsToMany(Subject, { through: "Grade", foreignKey: { name: "studentID", allowNull: false }, as: "grades" })
// Subject.belongsToMany(Student, { through: "Grade", foreignKey: { name: "subjectID", allowNull: false }, as: "grades" })

Subject.belongsTo(Teacher, {
  foreignKey: { 
    name: "teacherID",
    allowNull: false,
  }
})
Teacher.hasMany(Subject, {
  foreignKey: { 
    name: "teacherID",
    allowNull: false,
  }
})

Student.hasMany(Grade, {
  foreignKey: { 
    name: "studentID",
    allowNull: false,
  }
})
Student.hasMany(Absence, {
  foreignKey: { 
    name: "studentID",
    allowNull: false,
  }
})

Subject.hasMany(Grade, {
  foreignKey: { 
    name: "subjectID",
    allowNull: false,
  }
})
Subject.hasMany(Absence, {
  foreignKey: { 
    name: "subjectID",
    allowNull: false,
  }
})

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

await sequelize.sync()