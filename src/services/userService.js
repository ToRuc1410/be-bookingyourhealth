import bcrypt from 'bcryptjs';
import db from '../models/index';
// hash password for createNewUser

const salt = bcrypt.genSaltSync(10);
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExits = await checkUserEmail(email);
            if (isExits) {
                // user already exist
                let user = await db.User.findOne({
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true,
                });
                if (user) {
                    // check Password
                    let checkPW = await bcrypt.compareSync(password, user.password); // false
                    if (checkPW) {
                        userData.errCode = 0;
                        userData.errMessage = 'Successful';
                        // delete password because dont show password under client
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong Password ';
                    }
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = "Your's Email isn't Exits. Please check Again!";
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};
// check email to db
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

// get Users from db
let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    order: [['id', 'DESC']],
                    attributes: {
                        // loại bỏ trường password ra
                        exclude: ['password'],
                    },
                });
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        // loại bỏ trường password ra
                        exclude: ['password'],
                    },
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

// create New User from Client
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email is exist in database
            let checkEmail = await checkUserEmail(data.email);
            if (checkEmail) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your Email is already in used. Please try another Email',
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Create New User is Successful',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

// delete User by ID
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            });
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'The User isnt in the System',
                });
            }

            await db.User.destroy({
                where: { id: userId },
            });

            resolve({
                errCode: 0,
                errMessage: 'Destroy User is Successful',
            });
        } catch (e) {
            reject(e);
        }
    });
};

// update User from Client
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing Required Parameters',
                });
            }
            let userId = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (userId) {
                userId.firstName = data.firstName;
                userId.lastName = data.lastName;
                userId.address = data.address;
                userId.roleId = data.roleId;
                userId.positionId = data.positionId;
                userId.gender = data.gender;
                userId.phonenumber = data.phonenumber;
                userId.image = data.avatar;
                await userId.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update User is Successful',
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User isnt Found',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

// get all data table AllCodes
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required Parameters...',
                });
            } else {
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where: { type: typeInput },
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
};
