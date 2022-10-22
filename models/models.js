const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    sub: {type: DataTypes.STRING},
    given_name: {type: DataTypes.STRING},
    picture: {type: DataTypes.STRING}
})

const Company = sequelize.define('company', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    companyName: { type: DataTypes.STRING, allowNull: false },
    isCurrent: {type: DataTypes.BOOLEAN, allowNull: false}
})

const CompanyDetails = sequelize.define('company_details', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    companyName: { type: DataTypes.STRING, allowNull: false },
    registerDate: { type: DataTypes.DATE, allowNull: false },
    address: {type: DataTypes.STRING, allowNull: false},
    phoneNumber: {type: DataTypes.STRING, allowNull: false},
    bankAccount: { type: DataTypes.STRING, allowNull: false},
    bankName: {type: DataTypes.STRING, allowNull: false},
    bankCode: { type: DataTypes.STRING, allowNull: false},
    companyINN: { type: DataTypes.STRING, allowNull: false },
    companyOKED: { type: DataTypes.STRING, allowNull: false},
    manager: {type: DataTypes.STRING, allowNull: false},
})

const Employee = sequelize.define('employee', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    employeeFamilyName: {type: DataTypes.STRING, allowNull: false},
    employeeFirstName: {type: DataTypes.STRING, allowNull: false},
    employeePatronymic: { type: DataTypes.STRING },
    personalId: { type: DataTypes.STRING, allowNull: false},
    employeeINN: { type: DataTypes.STRING, allowNull: false },
    passportSeries: {type: DataTypes.STRING},
    passportNo: { type: DataTypes.STRING },
    issueAuthority: { type: DataTypes.STRING },
    issueDate: { type: DataTypes.DATE },
    employeeAddress: { type: DataTypes.STRING },
    employeePhoneNumber: { type: DataTypes.STRING },
    isEmployed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
})

const Contract = sequelize.define('contract', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    contractNo: {type: DataTypes.INTEGER, allowNull: false},
    contractDate: { type: DataTypes.DATE, allowNull: false },
    dismissalDate: { type: DataTypes.DATE, allowNull: true },
    position: { type: DataTypes.STRING, allowNull: false},
    salary: {type: DataTypes.INTEGER, allowNull: false},
    salaryRate: {type: DataTypes.DECIMAL, allowNull: false},
    workHours: { type: DataTypes.INTEGER, allowNull: false },
    workHoursStart: { type: DataTypes.INTEGER, allowNull: false },
    workHoursEnd: { type: DataTypes.INTEGER, allowNull: false },
    workSchedule: { type: DataTypes.STRING, allowNull: false },
    vacationDays: { type: DataTypes.INTEGER, allowNull: false },
})

const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderNo: { type: DataTypes.INTEGER, allowNull: false },
    orderDate: { type: DataTypes.DATE, allowNull: false },
    orderTypeId: { type: DataTypes.INTEGER, allowNull: false },
    employeeId: {type: DataTypes.INTEGER, allowNull: true},
    contractId: {type: DataTypes.INTEGER, allowNull: true},
    agreementId: {type: DataTypes.INTEGER, allowNull: true},
    dismissalDate: {type: DataTypes.DATE, allowNull: true},
    groundsForDismissal: { type: DataTypes.STRING, allowNull: true },
    compensationDays: { type: DataTypes.INTEGER, allowNull: true },
    averageSalary: { type: DataTypes.DECIMAL, allowNull: true },
})

const AdditionalAgreement = sequelize.define('additional_agreement', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    agreementNo: { type: DataTypes.INTEGER, allowNull: false },
    agreementDate: { type: DataTypes.DATE, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    salary: { type: DataTypes.INTEGER, allowNull: false },
    salaryRate: { type: DataTypes.DECIMAL, allowNull: false },
    workHoursStart: { type: DataTypes.INTEGER, allowNull: false },
    workHoursEnd: { type: DataTypes.INTEGER, allowNull: false },
    workHours: { type: DataTypes.INTEGER, allowNull: false },
    workSchedule: { type: DataTypes.STRING, allowNull: false },
    prevAgreementId: {type: DataTypes.INTEGER, allowNull: true}
})

User.hasMany(Company);
Company.belongsTo(User);

Company.hasMany(CompanyDetails, {onDelete: 'cascade'});
CompanyDetails.belongsTo(Company);

Company.hasMany(Employee, {onDelete: 'cascade'});
Employee.belongsTo(Company);

Employee.hasMany(Contract);
Employee.hasMany(AdditionalAgreement);
Company.hasMany(Contract, { onDelete: 'cascade' });
Company.hasMany(AdditionalAgreement, { onDelete: 'cascade' });
Contract.belongsTo(Company);
AdditionalAgreement.belongsTo(Company);
Contract.belongsTo(Employee);
AdditionalAgreement.belongsTo(Employee);


Company.hasMany(Order, { onDelete: 'cascade' });
Order.belongsTo(Company);

Employee.hasMany(Order, {onDelete: 'restrict'});

// Order.hasOne(Contract, { onDelete: 'cascade'})
// Order.hasOne(AdditionalAgreement, { onDelete: 'cascade'})
// Contract.belongsTo(Order);
// AdditionalAgreement.belongsTo(Order);

Contract.hasMany(AdditionalAgreement, { onDelete: 'cascade' })
AdditionalAgreement.belongsTo(Contract);


// Employee.hasOne(Employee);
// Order.hasOne(Contract);

module.exports = {
    User,
    Company,
    CompanyDetails,
    Employee,
    Contract,
    Order,
    AdditionalAgreement
}