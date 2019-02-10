"use strict";

const mimeTypeMap = {
    "image": "image/",
    "video": "video/",
    "audio": "audio/",
    "doc": ["application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint", "application/x-msaccess", "application/pdf"],
    "text": "text/",
    "archive": ["application/x-compressed", "application/zip", "application/octet-stream"]
};

module.exports = function (app, authSecurity, request) {
    app.get("/filesList", function (req, res) {

        if (authSecurity.getToken()) {
            var filters = JSON.parse(req.query.filters);
            var options = {
                url: 'https://slack.com/api/files.list',
                qs: {
                    token: authSecurity.getToken(),
                    count: 1000
                },
                method: "GET"
            };

            if (filters.channel) {
                options.qs.channel = filters.channel;
            }

            request(options, function (error, response, body) {
                var jsonResponse = JSON.parse(body);

                if (error) {
                    console.log(error);
                } else {
                    var files = [];
                    var filesToBeExcluded = 0;

                    for (var i = 0; i < jsonResponse.files.length; i++) {
                        var file = jsonResponse.files[i];

                        // avoid adding files added by default by slack
                        if (file.mode !== "space") {
                            // request has filter type applied
                            if (filters.type) {
                                if (file.mimetype.indexOf(mimeTypeMap[filters.type]) !== -1 || mimeTypeMap[filters.type].indexOf(file.mimetype) !== -1) {
                                    files.push({
                                        id: file.id,
                                        name: file.name,
                                        type: file.filetype,
                                        thumb: file.thumb_64 || file.thumb_video
                                    });
                                } else {
                                    filesToBeExcluded++;
                                }

                            } else {
                                files.push({
                                    id: file.id,
                                    name: file.name,
                                    type: file.filetype,
                                    thumb: file.thumb_64 || file.thumb_video
                                });
                            }
                        } else {
                            filesToBeExcluded++;
                        }
                    }

                    res.json({
                        results: files
                    });
                }
            });
        }
    });
};
