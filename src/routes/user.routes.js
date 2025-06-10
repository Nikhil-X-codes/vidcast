import Router from 'express';
import registeruser from '../Controllers/user.controller.js'

const userRouter = Router();

userRouter.post('/register', registeruser);


export default userRouter;



// routes-> it is a collection of endpoints that define the API of the application. It is responsible for routing the requests 
// to the appropriate controller functions based on the HTTP method and the URL path.