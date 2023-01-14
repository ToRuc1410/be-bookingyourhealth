import specialtyService from '../services/specialtyService';
let createNewSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.createNewSpecialty(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server"
        })
    }
}
let getAllSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.getAllSpecialty();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}
/// getDetailSpecialtyById and location
let getDetailSpecialtyById = async (req, res) => {
    try {
        let infor = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}
module.exports = {
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}