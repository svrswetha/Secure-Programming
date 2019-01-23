const express = require('express');
const router = express.Router();
const BAV = require('../commons/BasicAuthValidation');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const um = require("../commons/UsageMonitor");
module.exports = function (connection, bcrypt, jwt, config, shortid) {
    let usage_monitor = new um(connection, bcrypt, jwt, config, shortid);

    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './uploads');
        },
        filename: function (req, file, callback) {
            short_id = 'FU-' + shortid.generate();
            let new_file_name = short_id + "-" + file.originalname;
            console.dir(usage_monitor)
            connection.query("INSERT INTO `sp_share_new`.`files` (`original_file_name`,`file_name`,`file_id`) VALUES (" + connection.escape(file.originalname) + "," + connection.escape(new_file_name) + "," + connection.escape(short_id) + ")", function (error, result) {
                if (!error) {
                    callback(null, new_file_name);
                }
            })
        }
    });
    let file_size_limits = {
        fileSize: 1000
    }
    let uploading = multer({
        storage: storage,
        limits: file_size_limits
    }).array('filename', 1);


    router.post('/upload', function (req, res) {
        let xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        _bav(function () {
            let loginname = req.local.loginname;
            usage_monitor.validateFileLimit(function (file_size) {
                file_size_limits['fileSize'] = file_size;
                uploading(req, res, function (err) {
                    if (err) {
                        return res.end("Error uploading file.");
                    }
                    let rez = {}
                    rez['fileID'] = short_id;
                    res.send(JSON.parse(JSON.stringify(rez)))
                });


            })
        })

    });

    router.get('/download/:file_id', function (req, res) {
        let xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let file_id = connection.escape(req.params.file_id);
        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        _bav(function () {
            let login_name = connection.escape(req.local.loginname);
            connection.query("select group_membership.member_name from group_membership where group_membership.group_name in (select item_sharing.group_name from item_sharing where item_sharing.item_id in ( select items.item_id  from items where items.file_id=" + file_id + ")) and group_membership.member_name=" + login_name, function (error, result) {
                if (!error) {
                    connection.query("select * from files where files.file_id=" + file_id, function (error, result) {
                        let file_path = path.resolve("./uploads/" + result[0].file_name);
                        res.download(file_path);

                    })

                }
            })
        })


    })

    // Share Schema
    // items: pictures, videos, text, and other format “binary” (raw) files.

    router.post('/put', function (req, res) {
        let xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let itemBody = req.body
        let item_description = connection.escape(itemBody.description);
        let item_type = itemBody.fileid ? 'FILE' : 'FLAT';
        let file_id = connection.escape(itemBody.fileid);
        let item_id = connection.escape('IT-' + shortid.generate());
        let shared_group = connection.escape(itemBody['share-with']);
        let size = (itemBody.description.length)/1024/1024;

        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        _bav(function () {
            let loginname = connection.escape(req.local.loginname);
            if (item_type == 'FLAT') {
                item_type = connection.escape(item_type);
                
                usage_monitor.validateGroupUserUsage(loginname,shared_group,size,function (params) {
                    connection.query("INSERT INTO `sp_share_new`.`items` (`item_id`, `item_type`, `item_description`, `item_creator`) VALUES (" + item_id + ", " + item_type + ", " + item_description + "," + loginname + ")", function (error, result) {
                        if (!error) {
                            connection.query("select group_name from sp_share_new.groups where groups.group_name = " + shared_group, function (error, result) {
                                if (result.length > 0) {
                                    connection.query("INSERT INTO `sp_share_new`.`item_sharing` (`item_id`, `group_name`) VALUES (" + item_id + "," + shared_group + ")", function (error, result) {
                                        if (!error) {
                                            res.sendStatus(200);
                                        }
    
                                    })
                                }
                            })
                        }
                    })                    
                })

            } else {
                item_type = connection.escape(item_type);
                connection.query("INSERT INTO `sp_share_new`.`items` (`item_id`, `item_type`, `file_id`, `item_description`, `item_creator`) VALUES (" + item_id + ", " + item_type + ", " + file_id + "," + item_description + "," + loginname + ")", function (error, result) {
                    if (!error) {
                        connection.query("select group_name from sp_share_new.groups where groups.group_name = " + shared_group, function (error, result) {
                            if (result.length > 0) {
                                connection.query("INSERT INTO `sp_share_new`.`item_sharing` (`item_id`, `group_name`) VALUES (" + item_id + "," + shared_group + ")", function (error, result) {
                                    if (!error) {
                                        res.sendStatus(200);
                                    }

                                })
                            }
                        })

                    }
                })
            }



        })

    })

    // Share Schema
    // items: pictures, videos, text, and other format “binary” (raw) files.

    router.post('/remove', function (req, res) {
        let xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let itemBody = req.body
        let item_id = connection.escape(req.body.item_id);

        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        _bav(function () {
            let loginname = connection.escape(req.local.loginname);
            connection.query("SELECT items.file_id,files.file_name FROM sp_share_new.items items, sp_share_new.files files WHERE items.file_id = files.file_id AND items.item_id = " + item_id, function (error, result) {
                if (!error) {
                    var file_res = result;
                    connection.query("delete from item_sharing where item_sharing.item_id =" + item_id, function (error, result) {
                        if (!error) {
                            connection.query("delete from items where item_id =" + item_id, function (error, result) {
                                if (!error) {
                                    if (file_res.length > 0) {
                                        var file_id = result[0].file_id;
                                        var file_name = result[0].file_name;
                                        connection.query("Delete files from files where files.file_id =" + connection.escape(file_id), function (error, result) {
                                            res.sendStatus(200);
                                            let file_path = "./uploads/" + file_name;
                                            fs.unlink(file_paths, function (err) {
                                                if (err && err.code == 'ENOENT') {
                                                    // file doens't exist
                                                    console.info("File doesn't exist, won't remove it.");
                                                } else if (err) {
                                                    // other errors, e.g. maybe we don't have enough permission
                                                    console.error("Error occurred while trying to remove file");
                                                } else {
                                                    console.info(`removed`);
                                                }
                                            });
                                        })
                                    } else {
                                        res.sendStatus(200);
                                    }
                                }
                            })

                        }
                    })
                }

            })



        })

    })

    router.get('/get', function (req, res) {
        let xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        _bav(function (params) {
            let loginname = connection.escape(req.local.loginname);
            connection.query("select item_id AS 'ID',item_type AS 'TYPE',item_description AS 'DESCRIPTION',timestamp AS 'TIMESTAMP',file_id AS 'FILE_ID' from sp_share_new.items where sp_share_new.items.item_creator = " + loginname, function (error, result) {
                if (!error) {
                    res.send(JSON.parse(JSON.stringify(result)));
                }
            })
        });
    })

    router.get('/get/:item_id', function (req, res) {
        let xx = req.header('authorization');
        let item_id = connection.escape(req.params.item_id);
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        _bav(function (params) {
            let loginname = connection.escape(req.local.loginname);
            connection.query("select item_id AS 'ID',item_type AS 'TYPE',item_description AS 'DESCRIPTION',timestamp AS 'TIMESTAMP' from sp_share_new.items where sp_share_new.items.item_creator = " + loginname + " and sp_share_new.items.item_id =" + item_id, function (error, result) {
                if (!error) {
                    res.send(JSON.parse(JSON.stringify(result)));
                }
            })
        });
    })

    router.get('/view', function (req, res) {
        let xx = req.header('authorization');
        let item_id = connection.escape(req.params.item_id);
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        _bav(function (params) {
            let loginname = connection.escape(req.local.loginname);
            connection.query("select items.*,item_sharing.group_name from group_membership join item_sharing on item_sharing.group_name = group_membership.group_name join items on item_sharing.item_id = items.item_id where group_membership.member_name = " + loginname, function (error, result) {
                if (!error) {
                    res.send(JSON.parse(JSON.stringify(result)));
                }
            })
        });
    })
    return router;
}