import userService from '../services/userService';

// Controller for Login
let handleLogin = async (req, res) => {
   let email = req.body.email;
   let password = req.body.password;
   // check email
   if (!email || !password) {
      res.status(500).json({
         errCode: 1,
         message: 'Missing Inputs parameter!',
      });
   }
   let userData = await userService.handleUserLogin(email, password);
   return res.status(200).json({
      errCode: userData.errCode,
      message: userData.errMessage,
      user: userData.user ? userData.user : {},
   });
};

// Controller for ReadAllUser
let handleGetAllUser = async (req, res) => {
   // trả về allUser hoặc 1 user
   let id = req.query.id;
   if (!id) {
      return res.status(200).json({
         errCode: 1,
         errMessage: 'Missing required parameter',
         users: {},
      });
   }
   let users = await userService.getAllUser(id);
   return res.status(200).json({
      errCode: 0,
      errMessage: 'OK',
      users,
   });
};

// Controller for CreateNewUser
let handleCreateNewUser = async (req, res) => {
   let message = await userService.createNewUser(req.body);
   return res.status(200).json(message);
};

//Controller for EditUser
let handleEditUser = async (req, res) => {
   let data = req.body;
   let message = await userService.updateUserData(data);
   return res.status(200).json(message);
};

// Controller for DeleteUser
let handleDeleteUser = async (req, res) => {
   if (!req.body.id) {
      return res.status(200).json({
         errCode: 1,
         errMessage: 'Missing required parameters!',
      });
   }
   let message = await userService.deleteUser(req.body.id);
   return res.status(200).json(message);
};

// get All data Table: AllCode
let getAllCode = async (req, res) => {
   try {
      let data = await userService.getAllCodeService(req.query.type);
      return res.status(200).json(data);
   } catch (e) {
      console.log('get allcodes error', e);
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error From Server',
      });
   }
};
module.exports = {
   handleLogin: handleLogin,
   handleGetAllUser: handleGetAllUser,
   handleCreateNewUser: handleCreateNewUser,
   handleEditUser: handleEditUser,
   handleDeleteUser: handleDeleteUser,
   getAllCode: getAllCode,
};
