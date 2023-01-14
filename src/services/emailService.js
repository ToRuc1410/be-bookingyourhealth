require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Booking Your Health" <ngotruc917@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: 'Thông Tin Đặt Lịch Khám Bệnh', // Subject line
        html: getBodyHTML(dataSend),
    });
};
let getBodyHTML = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào: ${dataSend.patientLastName} ${dataSend.patientFirstName}! </h3>
        <p>Bạn Vừa đặt lịch khám bệnh online trên Booking Your Health </p>
        <h4>Thông Tin Đặt Lịch Khám Bệnh: </h4>
        <div><p>Thời Gian: ${dataSend.time}</p></div>
        <div><p>Bác Sĩ Khám: ${dataSend.doctorName}</p></div>
        <p>Nếu Thông tin trên là đúng Sự Thật vui lòng CLICK vào link sau. Để Xác Nhận!</p>
        <a href=${dataSend.redirectLink} target="_blank" > Click Here</a>
        <div> Xin Chân Thành Cảm Ơn </div>`;
    } else if (dataSend.language === 'en') {
        result = `<h3>Dear: ${dataSend.patientLastName} ${dataSend.patientFirstName}! </h3>
        <p>You just booked an online medical appointment on Booking Your Health </p>
        <h4>Information for Appointment Appointment: </h4>
        <div><p>Time: ${dataSend.time}</p></div>
        <div><p>Doctor: ${dataSend.doctorName}</p></div>
        <p>If the above information is true, please CLICK on the following link. Confirm!</p>
        <a href=${dataSend.redirectLink} target="_blank" > Click Here</a>
        <div> Thanks!!! </div>`;
    }
    return result;
};
let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào: ${dataSend.patientLastName} ${dataSend.patientFirstName}! </h3>
        <p> Booking Your Health </p>
        <h4>Thông Tin Hóa Đơn/Đơn Thuốc được gửi kèm trong file đính kèm bên dưới.</h4>
        <div> Xin Chân Thành Cảm Ơn </div>`;
    } else if (dataSend.language === 'en') {
        result = `<h3>Dear: ${dataSend.patientLastName} ${dataSend.patientFirstName}! </h3>
        <p>Booking Your Health </p>
        <h4>Note: </h4>
        <div> Thanks!!! </div>`;
    }
    return result;
};
let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Booking Your Health" <ngotruc917@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: 'Thông Tin Kết Quả Khám Bệnh', // Subject line
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split('base64')[1],
                        encoding: 'base64',
                    },
                ],
            });
            resolve(true);
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    sendSimpleEmail,
    sendAttachment,
};
