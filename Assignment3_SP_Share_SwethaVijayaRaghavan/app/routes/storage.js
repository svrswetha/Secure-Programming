const express = require('express');
const router = express.Router();
const BAV = require('../commons/BasicAuthValidation');
const multer = require('multer');
const fs = require('fs');
const path = require("path");

module.exports = function (connection, bcrypt, jwt, config, shortid) {
    router.post('/limit-group-usage', function (req, res) {
        let xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        let group_name = req.body.group_name;
        let group_limit = req.body.group_limit;
        _bav(function (params) {
            connection.query("UPDATE `sp_share_new`.`entity_storage_rules_with_usage` SET `limit`=" + connection.escape(group_limit) + " WHERE  `group_name`=" + connection.escape(group_name) + " AND `entity_type`='G' LIMIT 1;", function (error, result) {
                if (!error) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }
            })

        })
    });

    router.post('/limit-user-usage', function (req, res) {
        let xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        let user_name = req.body.user_name;
        let user_limit = req.body.user_limit;
        _bav(function (params) {
            connection.query("UPDATE `sp_share_new`.`entity_storage_rules_with_usage` SET `limit`=" + connection.escape(user_limit) + " WHERE  `user_name`=" + connection.escape(user_name) + " AND `entity_type`='U' LIMIT 1;", function (error, result) {
                if (!error) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }
            })

        })
    });
    router.post('/limit-file-usage', function (req, res) {
        let xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        let file_limit = req.body.file_limit;
        _bav(function (params) {
            connection.query("UPDATE `sp_share_new`.`entity_storage_rules_with_usage` SET `limit`=" + connection.escape(file_limit) + " WHERE  `group_name` IS NULL AND `user_name` IS NULL  AND `entity_type`='F' LIMIT 1;", function (error, result) {
                if (!error) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }
            })

        })
    });

    return router;
}