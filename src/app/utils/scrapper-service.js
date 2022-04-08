const cherio = require('cherio');
const request = require('request');
const rp = require('request-promise');

exports.scrapMediaLinks = async (data) => {
    const singleUrl = data.url[0];
    const resData = await getResult(singleUrl);

    return await resData;
};

async function getResult(singleUrl) {
    return new Promise((resolve, reject) => {
        request(singleUrl, (error, response, html) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }

            // scrapping Images for given web url
            let imgList = [];
            const $ = cherio.load(html);

            $("img").each((index, imageElement) => {
                const imgUrl = $(imageElement).attr("src");
                imgList.push(imgUrl);
            });
            resolve(imgList);
        });
    });
};
