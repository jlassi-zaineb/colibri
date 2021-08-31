const express = require('express');
const routes = require('./backend/controllers/routes')
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const urlDB = process.env.MONGO || 'mongodb://localhost:27017/colibri'
mongoose.connect(urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.info('server started on port : ' + port)
})
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use('/', routes);
app.use(express.static('build'));