// All controller logic for CRUD operation will stay here

const { scrapMediaLinks } = require('../utils/scrapper-service');
const MediaScrapperModel = require('../model/scrapper-model');

// Resolve Web URL(s) to fetch media  URL(s)
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

    if (!mediaUrlPayload.imgUrlList.length && !mediaUrlPayload.videoUrlList.length) {
        return res.status(204).send({
            statusCode: res.statusCode,
            statusMessage: res?.statusMessage || `No content found for ${mediaUrlPayload.url}`
        });
    }

    await savePayloadData(req, res, mediaUrlPayload);
};

const savePayloadData = async (req, res, mediaUrlPayload) => {

    // NOTE: Right way to pass value is by destructuring the object rather than passing obj again and again
    // const { id, url, name = '' , imgUrlList: [], videoUrlList: [] } = mediaUrlPayload;

    const mediaPayload = new MediaScrapperModel({
        // We are using domainName as an ID here
        _id: mediaUrlPayload.id,
        url: mediaUrlPayload.url,
        name: mediaUrlPayload.name,
        imageList: mediaUrlPayload?.imgUrlList || [],
        videoList: mediaUrlPayload?.videoUrlList || []
    });

    await mediaPayload.save()
        .then((data) => {
            return res.status(200).send({
                statusMessage: res.statusMessage || `Sucessfully scrapped data for ${data.url}`,
                statusCode: res.statusCode,
                data: data
            });
        }).catch((err) => {
            return res.status(400).send({
                statusMessage: `unable to scrap webURl ${mediaUrlPayload.url}. Error: ${err.message}`,
                statusCode: res.statusCode
            });
        });
};

// Get all scrapped data
exports.getScrappedMediaUrl = async (req, res) => {
    MediaScrapperModel.find()
        .then(data => {
            if (!data || !data.length) {
                return res.status(204).send({
                    data: data || {},
                    statusCode: res.statusCode,
                    statusMessage: `Data List is empty`
                });
            }

            res.status(200).send({
                count: data?.length || 0,
                statusMessage: 'Scrapped Data fetched successfully!',
                statusCode: res.statusCode,
                data: data,
            })
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: `${err.message} || unable to fetch Data`,
                statusCode: res.statusCode
            })
        });
};

// Get scrapped data by id or name
exports.findScrappedMediaUrlById = (req, res) => {
    const id = req.params.id;

    MediaScrapperModel.findById(id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    data: data,
                    message: `No media Url exist with ${id}`,
                    statusCode: res.statusCode
                })
            }
            res.status(200).send({
                data: [data],
                message: `Successfully fetched data for id: ${id}`,
                statusCode: res.statusCode
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectID') {
                return res.status(400).send({
                    message: `data not found. ID: ${id}`,
                    statusCode: res.statusCode

                });
            }

            return res.status(500).send({
                message: `Error fetching data. Id: ${id}`,
                statusCode: res.statusCode
            })
        });
};

// Delete all Scrapped media Data
exports.deleteScrappedMediaUrl = (req, res) => {
    MediaScrapperModel.deleteMany()
        .then(() => {
            res.status(200).send({
                statusCode: res.statusCode,
                statusMessage: `All Data delted successfully`
            });
        })
        .catch(err => {
            return res.status(500).send({
                statusCode: res.statusCode,
                statusMessage: `${err.message} || unable to delete scrapped data`
            });
        });
};