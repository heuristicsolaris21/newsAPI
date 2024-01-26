const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const News = require("./model/News");

const app= express();
app.use(express.json());

app.use(cors());

function getTodayDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();

    // Combine components into the desired format
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}


app.get("/getNews", async (req, res) => {
    const todayDate = getTodayDate();
    try {
        const { startingPrice, mileage } = req.query;
        // A D D   other query params and their variables
        const query = {};

        if (startingPrice) query.startingPrice = { $gte: parseInt(price) };
        if (mileage) query.mileage = { $gte: parseInt(mileage) };
        console.log(query);

        const bikes = await Bike.find(query);
        res.json(bikes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//  P O S T   R E Q U E S T 
app.post("/addNews", async (req, res) => {
    const todayDate = getTodayDate();
    const newsData = {
        "headline": req.body.headline,
        "publishDate": todayDate,
        "content": req.body.content,
        "image": req.body.image,
        "pdfLink": req.body.pdfLink
    };
    console.log(newsData);
    const newNews = new News(newsData);

    try {
        const savedNews = await newNews.save();
        res.status(200).json(savedNews);
    } catch (error) {
        res.status(500).json(error);
    }
});

mongoose.connect(
    "mongodb://shamlinlearning:zJuHgQMxwcKWlB8B@ac-08dhk2y-shard-00-00.n6hxill.mongodb.net:27017,ac-08dhk2y-shard-00-01.n6hxill.mongodb.net:27017,ac-08dhk2y-shard-00-02.n6hxill.mongodb.net:27017/kovaiNEWS?ssl=true&replicaSet=atlas-pww4uv-shard-0&authSource=admin&retryWrites=true&w=majority"
    ).then(console.log("Connected to MongoDB !")
);

app.listen(8080, ()=>{
    console.log("Server started at port 8080");
});