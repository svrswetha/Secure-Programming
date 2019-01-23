module.exports = function (connection, bcrypt, jwt, config, token, req, res) {
    return {
        validateUserUsage: function (user_name, item_size, callback) {
            connection.query("SELECT * FROM entity_storage_rules_with_usage WHERE entity_storage_rules_with_usage.entity_type = 'U' AND entity_storage_rules_with_usage.user_name =" + user_name + " AND entity_storage_rules_with_usage.`limit` >= (entity_storage_rules_with_usage.`usage` + " + item_size + ")", function (error, result) {
                if (error) {
                    res.sendStatus(300)
                } else {
                    callback()
                }
            })

        },
        validateGroupUsage: function (group_name, item_size, callback) {
            connection.query("SELECT * FROM entity_storage_rules_with_usage WHERE entity_storage_rules_with_usage.entity_type = 'G'  AND entity_storage_rules_with_usage.group_name =" + group_name + " AND entity_storage_rules_with_usage.`limit` >= (entity_storage_rules_with_usage.`usage` + " + item_size + ")", function (error, result) {
                if (error) {
                    res.sendStatus(300)
                } else {
                    callback()
                }
            })

        },
        validateGroupUserUsage: function (user_name, group_name,item_size,callback) {
            connection.query("SELECT * FROM entity_storage_rules_with_usage WHERE entity_storage_rules_with_usage.entity_type = 'GU' AND entity_storage_rules_with_usage.user_name ="+user_name+" AND entity_storage_rules_with_usage.group_name =" + group_name + " AND entity_storage_rules_with_usage.`limit` >= (entity_storage_rules_with_usage.`usage` + " + item_size + ")", function (error, result) {
                if (error) {
                    res.sendStatus(300)
                } else {
                    callback()
                }
            })
        },
        validateFileLimit:function (callback) {
            connection.query("SELECT entity_storage_rules_with_usage.`limit` FROM entity_storage_rules_with_usage WHERE entity_storage_rules_with_usage.entity_type = 'F'", function (error, result) {
                let file_size = result[0]['limit'];
                if (error) {
                    res.sendStatus(300)
                } else {
                    callback(file_size)
                }
            })
        },
        updateUserUsage:function (user_name,group_name,item_size,callback) {
            connection.query("UPDATE `sp_share_new`.`entity_storage_rules_with_usage` SET `usage`='000003' WHERE  `group_name` IS NULL AND `user_name`='go3swetha' AND `limit`=000200 AND `usage`=000002 LIMIT 1;")
        },
        initUserUsage: function (user_name) {
            connection.query("INSERT INTO `sp_share_new`.`entity_storage_rules_with_usage` (`user_name`, `limit`, `usage`, `entity_type`) VALUES ("+user_name+", '1000', '0000', 'U');")
        },
        initGroupUserUsage: function (user_name,group_name) {
            connection.query("INSERT INTO `sp_share_new`.`entity_storage_rules_with_usage` (`group_name`, `user_name`, `limit`, `usage`, `entity_type`) VALUES ("+group_name+", "+user_name+", '001000', '0', 'GU');")
        },
        initGroupUsage: function (group_name) {
            connection.query("INSERT INTO `sp_share_new`.`entity_storage_rules_with_usage` (`group_name`, `limit`, `usage`, `entity_type`) VALUES ("+group_name+", '1000', '0', 'G');")
        },
        initFileUsage: function () {
            connection.query("INSERT INTO `sp_share_new`.`entity_storage_rules_with_usage` (`limit`, `usage`, `entity_type`) VALUES ('1000', '100', 'F');")
        },
        updateGroupUserUsage:function (group_name,user_name) {
            
        }
    }
}