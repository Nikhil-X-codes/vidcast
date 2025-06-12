import Router from 'express';
import {registeruser,loginuser,logoutuser } from '../Controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js';
import {verifyjwt } from '../middlewares/auth.middleware.js'


const userRouter = Router();

userRouter.post('/register', 

upload.fields([{ name: 'avatar', maxCount: 1 },

    { name: 'coverimage', maxCount: 1 }]),

registeruser);

userRouter.post('/login',loginuser)


userRouter.post('/logout',
verifyjwt,
logoutuser)


export default userRouter;



// routes-> it is a collection of endpoints that define the API of the application. It is responsible for routing the requests 
// to the appropriate controller functions based on the HTTP method and the URL path.