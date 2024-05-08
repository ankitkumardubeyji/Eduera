// HighOrder function for accepting the asynchronous function

// function for handling the asynchronous operations
export const asyncHandler = (requestHandler) =>{ // request handler is the function / asynchronous operations
    return (req,res,next) =>{ // returns an anymous / middleware function that wraps around the original function request handler 
        Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err)) // executes the request handler function making the requestHandler to return promise 
    }
}

