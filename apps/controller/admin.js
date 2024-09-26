var express = require("express");
var router = express.Router();

var user_md = require("../model/users")

var helper = require("../helpers/helper");

router.get("/", function(req, res){
    res.json({"message": "This is admin page"});
});

router.get("/signup", function(req, res){
    res.render("signup", {data: {}});
});

router.post("/signup", function(req, res){
    var user = req.body;

    if(user.email.trim().length == 0){
        res.render("signup", {data: {error: "Email is required"}});
    }

    if(user.passwd != user.repasswd && user.passwd.trim().length != 0){
        res.render("signup", {data: {error: "Password is not match"}});
    }
    //insert to DB
    var password = helper.hash_password(user.passwd);

    user = {
        email: user.email,
        password: password,
        fist_name: user.fist_name,
        last_name: user.last_name,
    };

   var result = user_md.addUser(user)

   .then(function (result) {
        if(!result){
            res.render("signup", {data: {error: "Could not insert user data to DB"}});
        }else {
            res.redirect("/admin/signin");
        }
    })
    .catch(function (error) {
        console.log(error);
        res.render("signup", {data: {error: "An error occurred while inserting user data"}});
    })
});

router.get("/signin", function(req, res){
    res.render("signin", {data: {}});
})

router.post("/signin", function(req, res){
    var params = req.body;

    if(params.email.trim().length == 0){
        res.render("signin", {data: {error: "Please enter email address"}});
    }else{
        var data = user_md.getUserByEmail(params.email);

        if(data){
            data.then(function (users){
                var user = users[0];

                var status = helper.compare_passwords(params.password, user.password);

                if(!status){
                    res.render("signin", {data: {error: "Wrong passwords"}});
                }else{
                    req.session.user = user;
                    console.log(req.session.user);
                    res.redirect("/admin/");
                }
            })
        }else{
            res.render("signin", {data: {error: "User not exist"}});
        }
    }
})

module.exports = router;