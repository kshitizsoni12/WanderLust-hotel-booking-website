//this is custom error class to handle express errors more effectively which inherits default error class of javascript
class ExpressError extends Error{
    constructor(status,message){
        super();
        this.status = status;
        this.message = message;
    }
}

module.exports = ExpressError;