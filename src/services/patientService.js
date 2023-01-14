import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
import { reject } from 'lodash';
let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
};

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.doctorId ||
                !data.timeType ||
                !data.date ||
                !data.firstName ||
                !data.lastName ||
                !data.address ||
                !data.selectedGender
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters',
                });
            } else {
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    // patientName: data.fullName,
                    patientFirstName: data.firstName,
                    patientLastName: data.lastName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                });
                // upsert data
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        gender: data.selectedGender,
                    },
                });
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            reason: data.reason,
                            token: token,
                        },
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save imformation patient is Success...',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters',
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1',
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment Success...',
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not Exit...',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    postBookAppointment,
    postVerifyBookAppointment,
};
