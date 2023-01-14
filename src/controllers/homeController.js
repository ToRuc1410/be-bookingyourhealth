import CRUDService from '../services/CRUDservice';

let getHomePage = (req, res) => {
   return res.render('homepage.ejs');
};

let getAboutPage = (req, res) => {
   return res.render('test/about.ejs');
};

let getCRUD = (req, res) => {
   return res.render('crud.ejs');
};
let postCRUD = async (req, res) => {
   let message = await CRUDService.createNewUser(req.body);
   return res.send('post crud from server');
};
let displayGetCRUD = async (req, res) => {
   let data = await CRUDService.getAllUsers();
   if (data) {
      // console.log(data);
      return res.render('display-CRUD.ejs', {
         dataTable: data,
      });
   } else {
      return res.send('Lấy dữ liệu không thành công');
   }
};
let getEditCRUD = async (req, res) => {
   let userId = req.query.id;
   if (userId) {
      let dataUser = await CRUDService.getUserInfoById(userId);
      return res.render('edit-CRUD.ejs', {
         dataUser: dataUser,
      });
   }
};
let putCRUD = async (req, res) => {
   let updateUser = req.body;
   let data = await CRUDService.updateUserData(updateUser);
   return res.render('display-CRUD.ejs', {
      dataTable: data,
   });
};
let deleteCRUD = async (req, res) => {
   let id = req.query.id;
   if (id) {
      await CRUDService.deleteUserById(id);
      return res.send('done');
   }
};
module.exports = {
   getHomePage: getHomePage,
   getAboutPage: getAboutPage,
   getCRUD: getCRUD,
   postCRUD: postCRUD,
   displayGetCRUD: displayGetCRUD,
   getEditCRUD: getEditCRUD,
   putCRUD: putCRUD,
   deleteCRUD: deleteCRUD,
};
