import Router from 'express';
import {registeruser, loginuser, logoutuser,refreshAccessToken, changePassword, getcurrentuser,updateUserDetails, updateimages,UserProfile,Watchhistory} from '../Controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js';
import {verifyJWT} from '../middlewares/auth.middleware.js'


const userRouter = Router();

userRouter.post('/register', 

upload.fields([{ name: 'avatar', maxCount: 1 },

    { name: 'coverimage', maxCount: 1 }]),

registeruser);

userRouter.post('/login',loginuser)

userRouter.post('/logout',verifyJWT,logoutuser);

userRouter.post('/refresh', refreshAccessToken);

userRouter.post('/change-password', verifyJWT, changePassword);
                              
userRouter.get('/current', verifyJWT, getcurrentuser);
 
userRouter.patch('/update', verifyJWT, updateUserDetails);                                         

userRouter.patch('/profile-pictures', verifyJWT, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverimage', maxCount: 1 }]), updateimages);

userRouter.get('/profile/:username', verifyJWT,UserProfile);

userRouter.get('/watch-history', verifyJWT, Watchhistory);   


export default userRouter;



// routes-> it is a collection of endpoints that define the API of the application. It is responsible for routing the requests 
// to the appropriate controller functions based on the HTTP method and the URL path.