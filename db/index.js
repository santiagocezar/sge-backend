import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
    logQueryParameters: true,
    benchmark: true
})

export const StudentTable = sequelize.define('Student', {
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

export const TeacherTable = sequelize.define('Teacher', {
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

export const AbsenceTable = sequelize.define('Absence', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: { type: DataTypes.DATE, allowNull: false },
  justified: { type: DataTypes.BOOLEAN, allowNull: false },
});

export const GradeTable = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  instance: { type: DataTypes.STRING, allowNull: false },
  grade: { type: DataTypes.INTEGER, allowNull: false },
});

export const EnrollmentTable = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

export const SubjectTable = sequelize.define('Subject', {
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

StudentTable.belongsToMany(SubjectTable, { through: "Enrollment", foreignKey: { name: "studentID", allowNull: false }, as: "enrollments" })
SubjectTable.belongsToMany(StudentTable, { through: "Enrollment", foreignKey: { name: "subjectID", allowNull: false }, as: "enrollments" })
// Student.belongsToMany(Subject, { through: "Absence", foreignKey: { name: "studentID", allowNull: false }, as: "absences" })
// Subject.belongsToMany(Student, { through: "Absence", foreignKey: { name: "subjectID", allowNull: false }, as: "absences" })
// Student.belongsToMany(Subject, { through: "Grade", foreignKey: { name: "studentID", allowNull: false }, as: "grades" })
// Subject.belongsToMany(Student, { through: "Grade", foreignKey: { name: "subjectID", allowNull: false }, as: "grades" })

SubjectTable.belongsTo(TeacherTable, {
  foreignKey: { 
    name: "teacherID",
    allowNull: false,
  }
})
TeacherTable.hasMany(SubjectTable, {
  foreignKey: { 
    name: "teacherID",
    allowNull: false,
  }
})

StudentTable.hasMany(GradeTable, {
  foreignKey: { 
    name: "studentID",
    allowNull: false,
  }
})
StudentTable.hasMany(AbsenceTable, {
  foreignKey: { 
    name: "studentID",
    allowNull: false,
  }
})

SubjectTable.hasMany(GradeTable, {
  foreignKey: { 
    name: "subjectID",
    allowNull: false,
  }
})
SubjectTable.hasMany(AbsenceTable, {
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