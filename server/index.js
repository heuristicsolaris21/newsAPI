const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const News = require("./model/News");

const app= express();
app.use(express.json());

app.use(cors());
app.use(
	cors({
		// origin: "http://localhost:3000",
		origin: "https://kovai-news-api.onrender.com",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

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
        const news = await News.find();
        res.json(news);
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
    // console.log(newsData);
    const newNews = new News(newsData);

    try {
        const savedNews = await newNews.save();
        res.status(200).json(savedNews);
    } catch (error) {
        res.status(500).json(error);
    }
});
// F I L T E R   BY YEAR
app.post("/filterByYear", async (req, res) => {
    try {
        const { year } = req.body;
        if (!year) {
            return res.status(400).json({ error: 'Year is required in the request body.' });
        }

        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);

        //"DD/MM/YYYY" format
        const formattedStartDate = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`;
        const formattedEndDate = `${endDate.getDate().toString().padStart(2, '0')}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getFullYear()}`;

        const filteredNews = await News.find({
            publishDate: { $gte: formattedStartDate, $lte: formattedEndDate }
        });

        res.status(200).json(filteredNews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// F I L T E R   BY MONTH AND YEAR
app.post("/filterByMonth", async (req, res) => {
    try {
        const { year, month } = req.body;

        if (!year || !month) {
            return res.status(400).json({ error: 'Both year and month are required in the request body.' });
        }

        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(`${year}-${parseInt(month) + 1}-01`);

        // Convert to "DD/MM/YYYY" format
        const formattedStartDate = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`;
        const formattedEndDate = `${endDate.getDate().toString().padStart(2, '0')}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getFullYear()}`;

        const filteredNews = await News.find({
            publishDate: { $gte: formattedStartDate, $lt: formattedEndDate }
        });

        res.status(200).json(filteredNews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

mongoose.connect(
    "mongodb://shamlinlearning:zJuHgQMxwcKWlB8B@ac-08dhk2y-shard-00-00.n6hxill.mongodb.net:27017,ac-08dhk2y-shard-00-01.n6hxill.mongodb.net:27017,ac-08dhk2y-shard-00-02.n6hxill.mongodb.net:27017/kovaiNEWS?ssl=true&replicaSet=atlas-pww4uv-shard-0&authSource=admin&retryWrites=true&w=majority"
    ).then(console.log("Connected to MongoDB !")
);

app.listen(8080, ()=>{
    console.log("Server started at port 8080");
});