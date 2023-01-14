import doctorService from '../services/doctorService';

let getTopDoctorHome = async (req, res) => {
    let limitDoctors = req.query.limit;
    if (!limitDoctors) limitDoctors = 10;
    try {
        // convert String => Interger use (+$)
        let doctors = await doctorService.getTopDoctorHomeSevice(+limitDoctors);
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error From Sever',
        });
    }
};
let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        // console.log('check doctors: ', doctors)
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server',
        });
    }
};
let postInforDoctor = async (req, res) => {
    try {
        let responsive = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(responsive);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server',
        });
    }
};
let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server',
        });
    }
};
let getDoctorMarkdown = async (req, res) => {
    try {
        let dataMarkdown = await doctorService.getDoctorMarkdownService(req.query.id);
        return res.status(200).json(dataMarkdown);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server',
        });
    }
};
let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateScheduleSevice(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server',
        });
    }
};
let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorService.getScheduleByDateSevice(req.query.doctorId, req.query.date);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server',
        });
    }
};
let getExtraInforDr = async (req, res) => {
    try {
        let infor = await doctorService.getExtraInforDrSevice(req.query.doctorId);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server',
        });
    }
};
let getProfileDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server',
        });
    }
};
// get patients for a doctor
let getListPatientForDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);
        console.log(infor);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server',
        });
    }
};
let sendRemedy = async (req, res) => {
    try {
        let infor = await doctorService.sendRemedy(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server',
        });
    }
};
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctor: postInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    getDoctorMarkdown: getDoctorMarkdown,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDr: getExtraInforDr,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
};
