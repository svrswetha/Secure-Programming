const express = require('express');
const router = express.Router();
const BAV = require('../commons/BasicAuthValidation');
const um = require('../commons/UsageMonitor')

module.exports = function (connection, bcrypt, jwt, config, shortid) {
    let usage_monitor = new um(connection, bcrypt, jwt, config);

    router.post('/new', function (req, res, next) {
        var xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        var token = TokenArray[1];
        const _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        _bav(function (loginname) {
            next();
        })
    }, function (req, res, next) {
        let group_name = connection.escape(req.body.group_name);
        let loginname = connection.escape(req.local.loginname);
        connection.query("INSERT INTO sp_share_new.`groups`(group_name, group_creator) VALUES (" + group_name + ", " + loginname + ")", function (err, result) {
            if (!err) {
                res.status(200).send(group_name + 'created');
                usage_monitor.initGroupUsage(group_name);

            } else{
                res.status(406).send(group_name + ': cannot be created');
            }
        });

    })
    router.post('/join', function (req, res, next) {
        var xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        var token = TokenArray[1];
        let gm_id = connection.escape('GM-' + shortid.generate());
        const _bav = new BAV(connection, bcrypt, jwt, config, token, req);
        let group_name = connection.escape(req.body.group_name);
        let member_type = connection.escape(req.body.member_type?req.body.member_type:'U');
        _bav(function (loginname) {
            connection.query("SELECT group_name FROM sp_share_new.`groups` WHERE group_name = " + connection.escape(req.body.group_name), function (err, result) {
                if (!err) {
                    connection.query("SELECT group_name FROM sp_share_new.`groups` WHERE group_name = " + connection.escape(req.body.group_name), function (error, result) {
                        if (!error) {
                            connection.query("INSERT INTO sp_share_new.group_membership (member_name,group_name,gm_id,member_type) VALUES (" + connection.escape(req.local.loginname) + ", " + connection.escape(req.body.group_name) + "," + gm_id +","+member_type+ ")", function (err, result) {
                                if (!err) {
                                    res.status(200).send("Added to the Group, Pending Approval");
                                    usage_monitor.initGroupUserUsage(connection.escape(req.local.loginname),connection.escape(connection.escape(group_name)));
                                }
                            })

                        }
                    });
                }
            });
        })
    })

    router.post('/makeGroupActive', function (req, res) {
        let group_name = connection.escape(req.body.group_name);
        let xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        _bav(function () {
            let login_name = connection.escape(req.local.loginname);
            connection.query("select userz.loginname from userz where (userz.usertype='R' or userz.usertype='A') and userz.loginname =" + login_name, function (error, result) {
                if (!error && result.length > 0) {
                    connection.query("UPDATE `sp_share_new`.`groups` SET `isActivated`='001' WHERE  `group_name`="+group_name, function (error, result) {
                        if (!error) {
                            res.sendStatus(200);
                        }
                    })
                } else {
                    res.sendStatus(401)
                }
            })

        })

    })
    router.post('/makeGroupMemberActive',function (req,res) {
        let group_name = connection.escape(req.body.group_name);
        let member_name = connection.escape(req.body.member_name);
        let xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        _bav(function () {
            let login_name = connection.escape(req.local.loginname);
            connection.query("select * from group_membership where group_membership.member_type='A' or group_membership.member_name ="+login_name,function(error,result){
                if(!error){
                    connection.query("UPDATE `sp_share_new`.`group_membership` SET `isAdded`='001' WHERE `group_name`="+group_name+" AND `member_name`="+member_name,function(result,error){
                        if(!error){
                            res.sendStatus(200);
                        }
                    })
                }
                else{
                    res.sendStatus(500);
                }
            })
            
        })
        
    })

    return router;
}