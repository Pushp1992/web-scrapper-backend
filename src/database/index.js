// DB connection config being exposed from here

const DBConfig = require('./config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const DBConnection = mongoose.connect(
    DBConfig.url, {
    useNewUrlParser: true
}
).then(() => {
    console.log(` \n \n 🚀 Database Connection successfull. 🚀`);
}).catch(err => {
    console.log(`Connection failed \n . Error: ${err}`);
    process.exit();
});

module.exports = DBConnection;
