import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';
import specialtyController from '../controllers/specialtyController';
import clinicController from '../controllers/clinicController';
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/getCRUD', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    // API handle User
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    // API get allCode
    router.get('/api/allcode', userController.getAllCode);

    // API handle Doctor
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    // Save Information Doctor from client
    router.post('/api/save-infor-doctor', doctorController.postInforDoctor);
    // Get Detail Doctor
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    // Get Patient Doctor
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    // Get Detail Doctor to Markdown
    router.get('/api/get-doctor-markdown', doctorController.getDoctorMarkdown);
    // api bulk-create many schedules for doctor and rollback all when validation
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    // Get Schedule of doctor
    router.get('/api/get-schedule-of-doctor', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDr);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    // post send remedy(Hóa đơn)
    router.post('/api/send-remedy', doctorController.sendRemedy);

    // API handle Patient
    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    // verify booking Email
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);

    //API create new specialty
    router.post('/api/create-new-specialty', specialtyController.createNewSpecialty);
    // API Get all specialty
    router.get('/api/get-all-specialties', specialtyController.getAllSpecialty);
    // API get detail specialty by Id
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    //API create new clinic
    router.post('/api/create-new-clinic', clinicController.createNewClinic);
    // API Get all clinic
    router.get('/api/get-all-clinics', clinicController.getAllClinic);
    // API get detail clinic by Id
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);
    return app.use('/', router);
};

module.exports = initWebRoutes;
