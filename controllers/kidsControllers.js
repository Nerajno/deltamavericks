/**
 * Created by esterlingaccime on 5/5/17.
 */


var express = require("express");

var router = express.Router();

var data = {
    "beacons": [
        {
            "status": "ACTIVE",
            "description": "Dot Beacon, reporting for duty!",
            "indoorLevel": {
                "name": "1"
            },
            "latLng": {
                "latitude": 47.669377099999998,
                "longitude": -122.1966037
            },
            "placeId": "ChIJTxax6NoSkFQRWPvFXI1LypQ",
            "advertisedId": {
                "type": "EDDYSTONE",
                "id": "hZ3uYXQBwm2IsAAAAAAAyA=="
            },
            "beaconName": "beacons/0123abcd4567efgh890",
            "expectedStability": "STABLE",
            "properties": {
                "type": "Radius Dot beacon",
                "location": "Entryway"
            }
        }
    ],
    "nextPageToken": "Civ55cv//f/9zN7NnMrGzZ7LnJ6bysbJnsmZzJ3Oz8/Pz8/Pz8/Pz8/PzP/+EAMh5L1umSgzmnQxBQHmb3DvF+sxZZVNTdNeID05AgACADQaAABQAFoLCdMiAswr49SsEAE",
    "totalCount": "3"
};


router.get("/", function (req, res) {
    res.render("index");
});

router.get("/profile", function (req, res) {
    res.render("profile");
});

router.get("/api/beacons", function (req, res) {
    res.json(data);
});


module.exports = router;