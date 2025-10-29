var express = require('express');
var router = express.Router();
var utils = require('../lib/base/utils');
var DAL = require('../lib/dal');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});
router.post('/register', function(req, res) {
    var user;
    if (req.body.userName) {
        if (!DAL.db) {
            return res.status(500).json({
                status: 'failed',
                error: 'Database not connected'
            });
        }
        
        DAL.db.collection('users').find({
            userName: req.body.userName
        }).toArray(function(err, users) {
            if (err) {
                console.error('Error finding user:', err);
                return res.status(500).json({
                    status: 'failed',
                    error: err.message
                });
            }

            if (!users || users.length === 0) {
                user = {
                    displayName: req.body.userName,
                    userName: req.body.userName,
                    guid: utils.guid(),
                    chips: 100
                };
                DAL.db.collection('users').insertOne(user, function(insertErr, result) {
                    if (insertErr) {
                        console.error('Error inserting user:', insertErr);
                        return res.status(500).json({
                            status: 'failed',
                            error: insertErr.message
                        });
                    }
                    res.json({
                        'status': 'success',
                        data: user
                    });
                });

            } else {
                user = users[0];
                res.json({
                    'status': 'success',
                    data: user
                });
            }
        });
    } else {
        res.json({
            status: 'failed'
        });
    }


});
router.post('/get', function(req, res) {
    var user;
    if (req.body.userName) {
        DAL.db.collection('users').find({
            userName: req.body.userName
        }).toArray(function(err, users) {
            if (!users || users.length === 0) {
                res.json({
                    status: 'failed'
                });
            } else {
                user = users[0];
            }
            res.json({
                'status': 'success',
                data: user
            });
        });
    } else {
        res.json({
            status: 'failed'
        });
    }
});

// Reset all users' chips to 100
router.post('/reset-chips', function(req, res) {
    if (!DAL.db) {
        return res.status(500).json({
            status: 'failed',
            error: 'Database not connected'
        });
    }
    
    DAL.db.collection('users').updateMany(
        {}, // Update all users
        { $set: { chips: 100 } }
    ).then(function(result) {
        res.json({
            status: 'success',
            message: 'All users chips reset to 100',
            modifiedCount: result.modifiedCount
        });
    }).catch(function(err) {
        console.error('Error resetting chips:', err);
        res.status(500).json({
            status: 'failed',
            error: err.message
        });
    });
});

module.exports = router;