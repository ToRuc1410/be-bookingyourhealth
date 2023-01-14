'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        //important:  Relationship Tables
        static associate(models) {
            //an user belongto(thuộc về) many Table Allcode

            //User(positionId) - Allcode(keyMap)
            User.belongsTo(models.Allcode, {
                foreignKey: 'positionId',
                targetKey: 'keyMap',
                as: 'positionData',
            });

            //User(gender) - Allcode(keyMap)
            User.belongsTo(models.Allcode, {
                foreignKey: 'gender',
                targetKey: 'keyMap',
                as: 'genderData',
            });

            //User(doctorId) - markDown(doctorId)
            User.hasOne(models.Markdown, { foreignKey: 'doctorId' });
            //User(doctorId) - Doctor_Infor(doctorId)
            User.hasOne(models.Doctor_Infor, { foreignKey: 'doctorId' });
            //User(doctorId) - Schedule(doctorId)
            User.hasMany(models.Schedule, { foreignKey: 'doctorId', as: 'doctorData' });
            //User(patientId) - Booking(doctorId)
            User.hasMany(models.Booking, { foreignKey: 'patientId', as: 'patientData' });
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            address: DataTypes.STRING,
            phonenumber: DataTypes.STRING,
            gender: DataTypes.STRING,
            image: DataTypes.STRING,
            roleId: DataTypes.STRING,
            positionId: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
        }
    );
    return User;
};
