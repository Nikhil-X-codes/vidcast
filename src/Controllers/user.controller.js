import asynchandler from "../utils/asynchandler.js";


const registeruser= asynchandler(async (req, res) => {
    res.status(200).json({
        message: "User registered successfully",
        success: true,
    });
})

export default registeruser;



// controller-> it is a function that handles the request and response objects. It contains the business
//  logic for the application. It is responsible for processing the request, interacting with the database,
//  and sending the response back to the client.