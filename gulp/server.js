const express = require('express');
const app = express();
const path = require('path');
var cookieParser = require('cookie-parser');

const TAG = "[server]";

app.set('view engine', 'ejs');
app.set('absoluteUrl','this is absolute url')
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname + '/html'))
var fakeUserSession = null;

app.use(cookieParser());
app.use(function(req, res, next) {
    if(req.cookies["FAKE_LOGIN"] == "true") {
        req.userSession = {};
    }
    next();
});

app.get("/", function(req, res) {
    res.render("index", {
        pageid: "/index",
        companyList: [],
        sessionData: {},
        userSession: req.userSession,
        config: {
            proxy_server: "/partner",
            onboarding_server: {
                googleAnalyticsId: ""
            }
        }
    });
});

app.get("/partner", function(req, res) {
    res.redirect("/distribution");
});

app.get("/login", function(req, res) {
    res.cookie("FAKE_LOGIN", "true");
    res.redirect("/");
});

app.get("/logout", function(req, res) {
    res.cookie("FAKE_LOGIN", "false");
    res.redirect("/");
});

app.get("/blog/*", function(req, res) {
    res.render("blog/page.ejs", {
        pageid: "/" + req.url,
        companyList: [],
        sessionData: {},
        userSession: req.userSession,
        query: req.query,
        config: {
            proxy_server: "/partner",
            onboarding_server: {
                googleAnalyticsId: ""
            }
        }
    });
});

app.get("*", function(req, res) {
    console.log('sss', req)
    res.render(req.url.substring(1).split("?")[0], {
        pageid: "/" + req.url,
        companyList: [],
        sessionData: {},
        userSession: req.userSession,
        query: req.query,
        config: {
            proxy_server: "/partner",
            onboarding_server: {
                googleAnalyticsId: ""
            }
        }
    });
});


var port = process.env.SERVER_PORT || 3000;
app.listen(port);
console.log(TAG, "listening on port " + port);
