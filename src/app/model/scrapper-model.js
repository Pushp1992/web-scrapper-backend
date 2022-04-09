// ToDo model which expose the schema of todo with it's respective fields

const mongoose = require('mongoose');

const MediaScrapperSchema = mongoose.Schema(
    {
        _id: String,
        url: String,
        name: String,
        imageList: Array,
        videoList: Array
    },
    { timeStamps: true }
);

module.exports = mongoose.model('MediaScrapper', MediaScrapperSchema);
