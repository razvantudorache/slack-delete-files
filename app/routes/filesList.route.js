"use strict";

const mimeTypeMap = {
    "image": "image/",
    "video": "video/",
    "audio": "audio/",
    "doc": ["application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint",
        "application/x-msaccess", "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.presentationml.template",
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        "application/vnd.ms-access"],
    "text": "text/",
    "archive": ["application/x-compressed", "application/zip", "application/octet-stream"]
};

module.exports = function (app, request) {
    app.get("/filesList", function (req, res) {

        if (req.session.token) {
            var filters = JSON.parse(req.query.filters);
            var options = {
                url: 'https://slack.com/api/files.list',
                qs: {
                    token: req.session.token,
                    count: 1000
                },
                method: "GET"
            };

            if (filters.channel) {
                options.qs.channel = filters.channel;
            }

            request(options, function (error, response, body) {
                var jsonResponse = JSON.parse(body);
                var files = [];

                if (error) {
                    console.log(error);
                } else {

                    for (var i = 0; i < jsonResponse.files.length; i++) {
                        var file = jsonResponse.files[i];

                        // avoid adding files added by default by slack
                        if (file.mode !== "space") {
                            // request has filter type applied
                            if (filters.type) {
                                if (file.mimetype.indexOf(mimeTypeMap[filters.type]) !== -1 || mimeTypeMap[filters.type].indexOf(file.mimetype) !== -1) {
                                    storeFile (file, files);
                                }
                            } else {
                                storeFile (file, files);
                            }
                        }
                    }
                }

                res.json({
                    results: files
                });
            });
        }
    });
};

/**
 * Store file into files array
 * @param file
 * @param filesArray
 */
function storeFile(file, filesArray) {
    filesArray.push({
        id: file.id,
        name: file.name,
        thumb: file.thumb_64 || file.thumb_video
    });
}
