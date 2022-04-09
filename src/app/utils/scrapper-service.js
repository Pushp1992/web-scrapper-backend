const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise');

const customImdbWebUrl = "https://www.imdb.com/find?s=ep&q=star+wars&ref_=nv_sr_sm";

/**
 * 
 * @param {Object} data - Request body object
 * @returns {Array} list of all media urls
 */
exports.scrapMediaLinks = async (data) => {
    const webUrl = data.url[0];
    const resData = await getListOfMediaUrl(webUrl);

    return await resData;
};

/**
 * 
 * @param {string} webUrl - website url 
 * @returns {Array} list of media urls
 */
async function getListOfMediaUrl(webUrl) {
    return new Promise((resolve, reject) => {
        request(webUrl, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }

            const payloadObject = {};
            const $ = cheerio.load(body);

            // scrapping Image url for given web url
            const imgList = [];
            const videoList = [];
            const domainName = getDomainName(webUrl);

            $("img").each((index, imageElement) => {
                const imgUrl = $(imageElement).attr("src");
                let imgObj = {};

                if (webUrl === "https://www.dominos.co.in") {

                    imgObj.uimgUrlrl = webUrl + imgUrl;
                    imgList.push(imgObj);

                    payloadObject.id = domainName;
                    payloadObject.name = domainName;
                    payloadObject.imgUrlList = imgList;

                } else {
                    imgObj.imgUrl = imgUrl;
                    imgList.push(imgObj);

                    payloadObject.id = domainName;
                    payloadObject.name = domainName;
                    payloadObject.imgUrlList = imgList;
                }
            });

            // scrapping video url for given web url
            if (webUrl === customImdbWebUrl) {
                const baseUrl = 'https://www.imdb.com/';

                $(".findResult").each((index, mediaElement) => {
                    const $mediaElement = $(mediaElement);
                    // const videoImgUrl = $mediaElement.find('td a img').attr('src');
                    const videoUrl = $mediaElement.find('td a').attr('href');
                    const videoAbsoulteUrl = baseUrl + videoUrl;
                    videoList.push(videoAbsoulteUrl);

                    // const link = {
                    //     videoLink: $mediaElement.find('td a').attr('href')
                    // };

                    payloadObject.id = domainName;
                    payloadObject.name = domainName;
                    payloadObject.videoUrlList = videoList;
                });
            }
            resolve(payloadObject);
        });
    });
};

const getDomainName = (weburl) => {
    const splittedName = weburl.split('/');
    const domainName = splittedName[2].split('.')[1];
    return domainName;
};