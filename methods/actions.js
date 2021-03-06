var User = require('../models/user')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')

var functions = {
    addNew: function (req, res)
    {
        if((!req.body.name)||(!req.body.password))
        {
            res.json({Success: false, msg: 'Enter all the required fields'})
        }
        else
        {
            var newUser = User({
                name: req.body.name,
                password: req.body.password,
                role: req.body.role
            });
            newUser.save(function(err, newUser){
                if(err){
                    res.json({success: false, msg: 'Failed to save the details'})
                }
                else
                {
                    res.json({success: true, msg: 'Details have been successfully saved'})
                }
            })
        }
    },
    authenticate: function(req,res){
        User.findOne({
            name: req.body.name
        },
        function(err,user){
            if(err)
            {
                throw(err)
            }
            if(!user){
                res.status(403).send({success: false, msg:'Authentication Failed, User not Found'})
            }
            else
            {
                user.comparePassword(req.body.password, function(err,isMatch){
                    if(isMatch && !err)
                    {
                        var token = jwt.encode(user, config.secret)
                        res.json({success: true, token: token})
                    }
                    else
                    {
                        return res.status(403).send({status: false,msg:'Authentication failed Incorrect Password'})
                    }
                })
            }
        }
        )
    },

    // getinfo: function(req , res)
    // {
    //     if(req.headers.authorization && req.headers.authorization.split(' ')[0]==='Bearer')
    //     {
    //         var token = req.headers.authorization.split(' ')[1]
    //         var decoded = jwt.decode(token, config.secret)
    //         return res.json({success: true, msg: 'Hello'+ decoded.name})
    //     }
    //     else
    //     {
    //         return res.json({success: false, msg: 'No Headers'})
    //     }
    // }
    getinfo: function(req,res)
    {
        return res.json({success: true, msg: 'Hello User Info'})
    }
}

module.exports = functions