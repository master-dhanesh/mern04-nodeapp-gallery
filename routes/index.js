var express = require("express");
var router = express.Router();
const upload = require("./multer");
const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path");
const Gallery = require("../model/galleryModel");

let LOCAL_DB = [];

router.get("/", function (req, res, next) {
    Gallery.find()
        .then((cards) => {
            res.render("show", { cards });
        })
        .catch((err) => res.send(err));
});

router.get("/add", function (req, res, next) {
    res.render("add");
});

router.post("/add", function (req, res, next) {
    upload(req, res, function (err) {
        if (err) return res.send(err);
        Gallery.create({
            title: req.body.title,
            author: req.body.author,
            image: req.file.filename,
        })
            .then(() => {
                res.redirect("/");
            })
            .catch((err) => res.send(err));
    });
});

router.get("/update/:id", function (req, res, next) {
    Gallery.findById(req.params.id)
        .then((card) => {
            res.render("update", { card });
        })
        .catch((err) => res.send(err));
});

router.post("/update/:id", function (req, res, next) {
    upload(req, res, function (err) {
        if (err) return res.send(err);
        const updatedData = {
            title: req.body.title,
            author: req.body.author,
        };
        if (req.file) {
            fs.unlinkSync(
                path.join(
                    __dirname,
                    "..",
                    "public",
                    "uploads",
                    req.body.oldgallery
                )
            );
            updatedData.image = req.file.filename;
        }

        Gallery.findByIdAndUpdate(req.params.id, updatedData)
            .then(() => {
                res.redirect("/");
            })
            .catch((err) => re.send(err));
    });
});

router.get("/delete/:id", function (req, res, next) {
    Gallery.findByIdAndDelete(req.params.id)
        .then((deletedData) => {
            fs.unlinkSync(
                path.join(
                    __dirname,
                    "..",
                    "public",
                    "uploads",
                    deletedData.image
                )
            );

            res.redirect("/");
        })
        .catch((err) => res.send(err));
});

module.exports = router;
