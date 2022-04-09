// All controller logic for CRUD operation will stay here

const { scrapMediaLinks } = require('../utils/scrapper-service');
const MediaScrapperModel = require('../model/scrapper-model');

// fetch all scrapped data
exports.resolveMediaUrl = async (req, res) => {
    const REQUEST_BODY = req.body;

    // validate request_body
    if (!REQUEST_BODY || !Object.keys(REQUEST_BODY).length) {
        return res.status(400).send({
            statusCode: res.statusCode,
            message: res.statusMessage || 'payload can not be empty'
        });
    }

    const mediaUrlPayload = await scrapMediaLinks(REQUEST_BODY);
    console.log(mediaUrlPayload);

    // ToDo: send proper response if urls are not scrapped

    res.status(200).send({
        statusCode: res.statusCode,
        statusMessage: res?.statusMessag || 'success',
        data: res.data
    });

    // console.log(REQUEST_BODY);
};