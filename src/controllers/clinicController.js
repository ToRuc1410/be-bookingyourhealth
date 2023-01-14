import clinicService from '../services/clinicService';

let createNewClinic = async (req, res) => {
  try {
    let responsive = await clinicService.createNewClinic(req.body);
    return res.status(200).json(responsive);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error From Server',
    });
  }
};
let getAllClinic = async (req, res) => {
  try {
    let responsive = await clinicService.getAllClinic();
    return res.status(200).json(responsive);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error From Server',
    });
  }
};
let getDetailClinicById = async (req, res) => {
  try {
    let responsive = await clinicService.getDetailClinicById(req.query.id);
    return res.status(200).json(responsive);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error From Server',
    });
  }
};
module.exports = {
  createNewClinic,
  getAllClinic,
  getDetailClinicById,
};
