import db from '../models'


let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessege: "Missing Parameter..."
                })
            }
            else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                })
                resolve({
                    errCode: 0,
                    errMessege: "Add New Specialty is Successed..."
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            // change Image
            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                })
            }
            resolve({
                errCode: 0,
                errMessege: "Success...",
                data,
            })
        } catch (e) {
            reject(e);
        }
    })
}
let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessege: "Missing Parameter..."
                })
            }
            else {
                // get descriptionHTML
                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                })
                // if get descriptionHTML is "Ok" next find Doctor and location from Specialty  
                if (data) {
                    let doctorSpecialty = [];
                    // location == "all" => get All
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId']
                        });
                    } else {
                        // location == "location" from Client
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    // push doctorSpecialty on data
                    data.doctorSpecialty = doctorSpecialty;
                }
                // else empty
                else {
                    data = {};
                }
                console.log(data);
                resolve({
                    errCode: 0,
                    errMessege: "Success...",
                    data
                })

            }

        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createNewSpecialty, getAllSpecialty, getDetailSpecialtyById
}