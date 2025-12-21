// this is a function similar to try catch method that i will use to wrap allvasync code in index.js to prevent any asyncronous errors from crashing my server
// it takes a function as input and returns a function which handles any error occured inside the async function and passes it to next() middleware of express
// so that it can be handled in our error handling middleware in index.js

function asyncwrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err) => next(err));
    }
}

module.exports = asyncwrap;