const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config.json');
const Movie = require('./models/movies');
mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}cluster0-vvglk.mongodb.net/movies?retryWrites=true&w=majority`, {useNewUrlParser: true});

const database = mongoose.connection;
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function() {
  console.log('we are connected to mongo database');
});

// Convert our json data which gets sent into JS so we can process it
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
// enable cross origin requests (http to https)
app.use(cors());

// Create a console message showing us what request we're asking for
app.use(function(req, res, next){
    console.log(`${req.method} request for ${req.url}`);
    next();
});

//Home route
app.get('/', function(req, res){
    res.send('Welcome to my movie API. Use end-points to filter out the data');
});

//Add a new movie
app.post('/movies', function(req, res){
    const movie = new Movie({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        director: req.body.director,
        genre: req.body.genre,
        year: req.body.year
    });

    movie.save().then(result => {
        res.send(result);
    }).catch(err => res.send(err));
});

// Get all Movies
app.get('/allMovies', function(req, res){
    Movie.find().then(result => {
        res.send(result);
    })
})

//Get single Product based on ID
app.get('/movie/:id', function(req, res){
    const id = req.params.id;
    Movie.findById(id, function (err, movie) {
        res.send(movie);
    });
});

// Update a movie based on id
app.patch('/movie/:id', function(req, res){
    const id = req.params.id;
    const newMovie = {
      title: req.body.title,
      director: req.body.director,
      genre: req.body.genre,
      year: req.body.year
    };
    Movie.updateOne({ _id : id }, newMovie).then(result => {
        res.send(result);
    }).catch(err => res.send(err));
})


// Delete a movie based on id
app.delete('/movie/:id', function(req, res){
    const id = req.params.id;
    Movie.deleteOne({ _id: id }, function (err) {
        res.send('deleted');
    });
});

// Listen to the port number
app.listen(port, () => {
    console.clear();
    console.log(`application is running on port ${port}`)
});
