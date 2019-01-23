const express = require('express');
const router = express.Router();
const BAV = require('../commons/BasicAuthValidation');
const um = require('../commons/UsageMonitor')

module.exports = function (connection, bcrypt, jwt, config, shortid) {
    let usage_monitor = new um(connection, bcrypt, jwt, config);

    router.post('/signin', function (req, response) {
        let password = req.body.password;
        let loginname = req.body.loginname;
        if (loginname !== null && password !== null) {
            connection.query("SELECT password FROM sp_share_new.userz WHERE loginname = " + connection.escape(loginname), function (err, result) {
                console.log(result);
                if (result) {
                    var hash = result[0]['password'];
                    password = connection.escape(password);
                    bcrypt.compare(password, hash, function (err, res) {
                        console.log(res);
                        if (res) {
                            // create a token
                            var token = jwt.sign({
                                    loginname: loginname
                                }, config.secret, {
                                    expiresIn: 86400 // expires in 24 hours
                                },
                                function (err, token) {
                                    connection.query("UPDATE sp_share_new.userz SET jwt = " + connection.escape(token) + ", istokengenerated = true WHERE loginname = " + connection.escape(loginname))
                                    response.status(200).send({
                                        auth: true,
                                        token: token
                                    });
                                    console.dir(this);
                                }
                            );

                        }
                    });
                }
            });
        }

    });
    router.post('/signup', function (req, res) {
        console.log(req);
        let saltRounds = 10;
        let originalpwd = connection.escape(req.body.password);
        let loginname = connection.escape(req.body.loginname);
        let actualname = connection.escape(req.body.actualname);

        if (loginname !== null) {
            connection.query("SELECT * FROM sp_share_new.userz userz WHERE upper(userz.loginname) = upper(" + loginname + ")", function (err, result, fields) {
                if (result.length == 0) {
                    bcrypt.hash(originalpwd, saltRounds, function (error, hashedPwd) {
                        let hashed_Pwd = connection.escape(hashedPwd)
                        connection.query("Insert into sp_share_new.userz (actualname, loginname, password) VALUES (" + actualname + "," + loginname + "," + hashed_Pwd + ")", function (error, result, fields) {
                            if (error) {
                                res.sendStatus(409);
                            } else {
                                res.sendStatus(200);
                                usage_monitor.initUserUsage(loginname);
                            }
                            
                        });
                    });
                } else {
                    res.sendStatus(409);
                }

            });
        }
    });
    router.post('/makeUserAdmin', function (req, res) {
        let username = connection.escape(req.body.username);
        let xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        _bav(function () {
            let login_name = connection.escape(req.local.loginname);
            if (String(req.body.username).toLowerCase() == 'root') {
                res.sendStatus(401);
            } else {
                connection.query("select userz.loginname from userz where userz.usertype='R' and userz.loginname =" + login_name, function (error, result) {
                    if (!error && result.length > 0) {
                        connection.query("UPDATE `sp_share_new`.`userz` SET `usertype`='A' WHERE  `loginname`=" + username, function (error, result) {
                            if (!error) {
                                res.send(200)
                            }
                        })
                    }
                })
            }
        })
    })
    router.post('/makeUserActive', function (req, res) {
        let username = connection.escape(req.body.username);
        let xx = req.header('authorization');
        let TokenArray = xx.split(" ");
        let token = TokenArray[1];
        let _bav = new BAV(connection, bcrypt, jwt, config, token, req, res);
        _bav(function () {
            let login_name = connection.escape(req.local.loginname);
            if (String(req.body.username).toLowerCase() == 'root') {
                res.sendStatus(401);
            } else {
                connection.query("select userz.loginname from userz where (userz.usertype='R' or userz.usertype='A') and userz.loginname =" + login_name, function (error, result) {
                    if (!error && result.length > 0) {
                        connection.query("UPDATE `sp_share_new`.`userz` SET `isvalidated`='001' WHERE  `loginname`="+username,function(error,result){
                            if(!error){
                                res.sendStatus(200);
                            }
                        })
                    }
                    else{
                        res.sendStatus(401)
                    }
                })
            }
        })
    })
    return router;
}