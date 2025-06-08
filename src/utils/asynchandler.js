const asynchandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        console.error("Error in async handler:", error);
        res.status(500).json({ 
        message: error.message || "Internal Server Error" ,
        success: false });
    }
}

export default asynchandler;


// a reusable wrapper that automatically handles errors from async functions in Express routes, 
// keeping your code clean, safe, and consistent.it simply standardizes error handling across your application,