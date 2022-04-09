// all HTTP method (GET/PUT/POST/DELETE) route endpoint will be present here

module.exports = (app) => {

    // import controller here, which contains method for all CRUD operations
    const MediaScrapper = require('../controller/scrapper-controller');

    // api endpoint to query for all scrapped data
    app.post('/create', MediaScrapper.resolveMediaUrl);

    // api endpoint to get all scrapped data
    app.get('/fetch', MediaScrapper.getScrappedMediaUrl);

    // api endpoint to delete all scrapped data
    app.delete('/delete', MediaScrapper.deleteScrappedMediaUrl);
};
