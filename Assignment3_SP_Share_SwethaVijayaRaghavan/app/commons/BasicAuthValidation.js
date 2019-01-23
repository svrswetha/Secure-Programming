module.exports = function (connection, bcrypt, jwt, config, token,req,res) {
    return function(callback){
        if (!token) return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
            if (!err) {
                 connection.query("SELECT loginname FROM sp_share_new.userz WHERE loginname = " + connection.escape(decoded.loginname) + " AND jwt = " + connection.escape(token) + " AND istokengenerated = true", function (error, result) {
                    if (result) {
                        if(typeof callback == 'function'){
                            req.local = {};
                            req.local.loginname = decoded.loginname;
                            // res.local = {};
                            // res.local.loginname = decoded.loginname;
                            callback();
                        }
                    }
                });
            }
        });
    
    
    }
}