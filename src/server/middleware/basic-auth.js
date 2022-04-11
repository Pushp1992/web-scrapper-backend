const auth = require('basic-auth');

const mwBasicAuth = async (req, res, next) => {
    console.log('middleware: basic authentication');

    const user = await auth(req);
    const username = process.env.username;
    const password = process.env.password;

    if(user && user.name === username && user.pass ===  password) {
        console.log('basic auth succeed!')
        next()
    } else {
        console.log('basic auth failure!')
        res.statusCode = 401,
        res.send({"message": "Access denied!"});
    }
}

module.exports = mwBasicAuth;

