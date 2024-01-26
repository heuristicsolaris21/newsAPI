const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    "headline" : String,
    "publishDate" : String,
    "content" : String,
    "image" : String,
    "pdfLink" : String
}) 

module.exports = mongoose.model("News", newsSchema);