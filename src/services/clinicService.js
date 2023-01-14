import db from '../models/index';
let createNewClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.image ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.address
      ) {
        resolve({
          errCode: 1,
          errMessege: 'Missing Parameter...',
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          image: data.image,
          address: data.address,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errCode: 0,
          errMessege: 'Add New Clinic is Successed...',
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
      if (data && data.length > 0) {
        data.map((item, index) => {
          item.image = new Buffer(item.image, 'base64').toString();
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessege: 'Add New Clinic is Successed...',
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessege: 'Missing Parameter...',
        });
      } else {
        let data = await db.Clinic.findOne({
          where: { id: inputId },
          attributes: [
            'name',
            'address',
            'descriptionHTML',
            'descriptionMarkdown',
          ],
        });
        if (data) {
          let doctorClinic = [];
          doctorClinic = await db.Doctor_Infor.findAll({
            where: {
              ClinicId: inputId,
            },
            attributes: ['doctorId'],
          });

          // push doctorClinic on data
          data.doctorClinic = doctorClinic;
        }
        // else empty
        else {
          data = {};
        }
        resolve({
          errCode: 0,
          errMessege: 'Success...',
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createNewClinic,
  getAllClinic,
  getDetailClinicById,
};
