// this is a function similar to try catch method that i will use to wrap allasync code in index.js to prevent any asyncronous errors from crashing my server

function asyncwrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err) => next(err));
    }
}

module.exports = asyncwrap;