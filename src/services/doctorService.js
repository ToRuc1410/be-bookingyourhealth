import db from '../models/index';
import _, { reject } from 'lodash';
require('dotenv').config();
import emailService from '../services/emailService';
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
// get limitInput Doctor From client to db
let getTopDoctorHomeSevice = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                // get all Users but remove colum Password
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attribute: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attribute: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true,
            });
            resolve({
                errCode: 0,
                data: users,
            });
        } catch (e) {
            reject(e);
        }
    });
};
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image'],
                },
            });
            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (e) {
            reject(e);
        }
    });
};
//===============check validate from client
let checkValidate = (inputData) => {
    let arrCheck = [
        'doctorId',
        'contentHTML',
        'contentMarkdown',
        'action',
        'selectedPrice',
        'selectedPayment',
        'selectedProvince',
        'nameClinic',
        'addressClinic',
        'specialtyId',
    ];
    let isValid = true;
    let element = '';
    for (let i = 0; i < arrCheck.length; i++) {
        if (!inputData[arrCheck[i]]) {
            isValid = false;
            element = arrCheck[i];
            break;
        }
    }
    return {
        isValid,
        element,
    };
};
let saveDetailInforDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkValidate(data);
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing Parameters: ${checkObj.element}`,
                });
            } else {
                if (data.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId,
                    });
                } else if (data.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: data.doctorId },
                        raw: false,
                    });

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = data.contentHTML;
                        doctorMarkdown.contentMarkdown = data.contentMarkdown;
                        doctorMarkdown.description = data.description;
                        await doctorMarkdown.save();
                    }
                }

                // upsert to Doctor_Infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: data.doctorId,
                    },
                    raw: false,
                });
                if (doctorInfor) {
                    // Update
                    doctorInfor.priceId = data.selectedPrice;
                    doctorInfor.provinceId = data.selectedProvince;
                    doctorInfor.paymentId = data.selectedPayment;
                    doctorInfor.addressClinic = data.addressClinic;
                    doctorInfor.nameClinic = data.nameClinic;
                    doctorInfor.note = data.note;
                    doctorInfor.specialtyId = data.specialtyId;
                    doctorInfor.clinicId = data.clinicId;
                    await doctorInfor.save();
                } else {
                    // create
                    await db.Doctor_Infor.create({
                        doctorId: data.doctorId,
                        priceId: data.selectedPrice,
                        provinceId: data.selectedProvince,
                        paymentId: data.selectedPayment,
                        addressClinic: data.addressClinic,
                        nameClinic: data.nameClinic,
                        note: data.note,
                        specialtyId: data.specialtyId,
                        clinicId: data.clinicId,
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save Information Doctor is success.',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter',
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: { exclude: ['password'] },
                    // leftjoin->Markdown
                    include: [
                        {
                            model: db.Markdown,
                            // but i get 'description','contentHTML', 'contentMarkdown'
                            attributes: ['description', 'contentHTML', 'contentMarkdown'],
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attribute: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Doctor_Infor,
                            attribute: { exclude: ['id', 'doctorId'] },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'provinceTypeData',
                                    attribute: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentTypeData',
                                    attribute: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'priceTypeData',
                                    attribute: ['valueEn', 'valueVi'],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    // not dot table
                    nest: true,
                });
                // convert image(base64)->image(string)
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getDoctorMarkdownService = (dataid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataDoctor = await db.Markdown.findOne({
                where: { doctorId: dataid },
            });
            resolve({
                errCode: 0,
                data: dataDoctor,
            });
        } catch (e) {
            reject(e);
        }
    });
};
let bulkCreateScheduleSevice = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check data form client
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require Parameters',
                });
            }
            // process data for maxNumber(MAX_NUMBER_SCHEDULE)
            else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }

                // =================== compare database and data from client
                // get database
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attribute: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true,
                });
                // get start compare
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                // then crete data by bulkCreate with new datas
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Update is Successed...',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getScheduleByDateSevice = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'timeTypeData',
                            attribute: ['valueEn', 'valueVi'],
                        },
                        { model: db.User, as: 'doctorData', attribute: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true,
                });
                if (!dataSchedule) dataSchedule = [];
                resolve({
                    errCode: 0,
                    errMessage: 'Successed...',
                    data: dataSchedule,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getExtraInforDrSevice = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputId },
                    attribute: {
                        exclude: ['id', 'doctorId'],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'provinceTypeData',
                            attribute: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Allcode,
                            as: 'paymentTypeData',
                            attribute: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Allcode,
                            as: 'priceTypeData',
                            attribute: ['valueEn', 'valueVi'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attribute: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            // but i get 'description','contentHTML', 'contentMarkdown'
                            attributes: ['description', 'contentHTML', 'contentMarkdown'],
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attribute: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Doctor_Infor,
                            attribute: { exclude: ['id', 'doctorId'] },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'provinceTypeData',
                                    attribute: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentTypeData',
                                    attribute: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'priceTypeData',
                                    attribute: ['valueEn', 'valueVi'],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    // not dot table
                    nest: true,
                });
                // convert image(base64)->image(string)
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
// handle get patients for a doctor
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ['email', 'firstName', 'lastName', 'address', 'gender'],
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'genderData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: 'timeTypeBooking',
                            attributes: ['valueEn', 'valueVi'],
                        },
                    ],
                    raw: false,
                    // not dot table
                    nest: true,
                });
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.doctorId ||
                !data.patientId ||
                !data.timeType ||
                !data.imgBase64
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Required Parameters',
                });
            } else {
                //update patient status==='S3'(Done)
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2',
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save();
                }
                await emailService.sendAttachment(data);
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    getTopDoctorHomeSevice: getTopDoctorHomeSevice,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    getDoctorMarkdownService: getDoctorMarkdownService,
    bulkCreateScheduleSevice: bulkCreateScheduleSevice,
    getScheduleByDateSevice: getScheduleByDateSevice,
    getExtraInforDrSevice: getExtraInforDrSevice,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
};
