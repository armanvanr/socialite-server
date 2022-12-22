const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Users = require('./api/Users');
const Posts = require('./api/Posts');
const path = require('path');
const public = __dirname + "/public/";
const app = express();

//Configurations
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '500kb' }));
app.use(bodyParser.urlencoded({ extended: true }));


//Routes
const routes = [Users, Posts];
app.use('/', routes)

app.get('/', function (req, res) {
    res.sendFile(path.join(public + "index.html"));
});

//Mongoose Setup
const PORT = process.env.PORT || 6001;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log('Server runs at port ' + PORT));
}).catch((error) => console.log(error, ' did not connect'));