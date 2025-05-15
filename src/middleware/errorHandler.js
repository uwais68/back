// errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err); // You can log the error to the console or a logging service
  
    // Check if the error has a specific status code, or set a default one
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";
  
    // Send a structured error response
    res.status(statusCode).json({
      success: false,
      message,
      // Optionally, you can send more details like error stack in development
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  };
  
  export default errorHandler;
  