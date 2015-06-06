var http = require('http');
var express = require('express');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var server;

mongoose.connect(process.env.MONGOLAB_URI);

var db = mongoose.connection;
var Gif;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

    var gifSchema = mongoose.Schema({
        paths: {
            preview: String,
            high_resolution: String
        },
        hearts: Number
    });

    Gif = mongoose.model('gifs', gifSchema);

});

var hbs = exphbs.create({
    defaultLayout: '_layout',
    layoutsDir: 'dist/views/shared/',
    partialsDir: 'dist/views/shared/partials/',
    extname: '.hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {

    var data;

    Gif.find({}, function(err, gifs) {

        data = gifs.reverse() || [];
        res.render('../dist/views/home', {title: 'HOME', data : data});

    });

});

app.get('/:id', function (req, res) {

    var data;

    Gif.find({}, function(err, gifs) {

        data = gifs.reverse() || [];
        Gif.findById(req.params.id, function (err, gif) {

            if (err) {
                res.status(404).render('../dist/views/404', {title: '404'});
            } else {
                res.status(200).render('../dist/views/home', {title: 'GIF', gif : gif, data : data});
            }

        });


    });

});

app.post('/api/heart', function (req, res) {
    var id = req.body.id,
        action = req.body.action;

    Gif.findById(id, function (err, gif) {

        if (err) {
            res.send({ success: false, error: err });
        }

        gif.hearts = action === 'heart' ? gif.hearts + 1 : gif.hearts - 1;
        gif.save(function (err) {
            if (err) {
                res.send({ success: false, error: err });
            }
            res.send({ success: true, hearts: gif.hearts });
        });

    });
});

server = http.createServer(app);
server.listen(app.get('port'));
