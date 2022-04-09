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

    if (!mediaUrlPayload.imgUrlList.length && !mediaUrlPayload.videoUrlList.length) {
        return res.status(204).send({
            statusCode: res.statusCode,
            statusMessage: res?.statusMessage || `No content found for ${mediaUrlPayload.url}`
        });
    }

    const saveMediaUrlPayload = await savePayloadData(req, res, mediaUrlPayload);

    console.log('saved data: ', saveMediaUrlPayload);

    // ToDo: send proper response if urls are not scrapped

    // return res.status(200).send({
    //     statusCode: res.statusCode,
    //     statusMessage: res?.statusMessage || `Sucessfully scrapped data for ${mediaUrlPayload.url}`
    // });

    // console.log(REQUEST_BODY);
};

const savePayloadData = async (req, res, mediaUrlPayload) => {

    // console.log(mediaUrlPayload);

    // const { id, url, name = '' , imgUrlList: [], videoUrlList: [] } = mediaUrlPayload;

    const mediaPayload = new MediaScrapperModel({
        id: mediaUrlPayload.id,
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
            return res.status(500).send({
                statusMessage: `unable to create task. Error: ${err.message}`,
                statusCode: res.statusCode
            });
        });
};

exports.getScrappedMediaUrl = async (req, res) => {
    MediaScrapperModel.find()
        .then(task => {
            if (!task || !task.length) {
                return res.status(204).send({
                    data: task || {},
                    statusCode: res.statusCode,
                    statusMessage: `Data List is empty`
                });
            }

            res.status(200).send({
                count: task?.length || 0,
                statusMessage: 'Scrapped Data fetched successfully!',
                statusCode: res.statusCode,
                data: task,
            })
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: `${err.message} || unable to fetch Data`,
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