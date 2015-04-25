var express = require('express'),
    exphbs  = require('express-handlebars'),
    mongoose = require('mongoose'),
    app = express();

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

    var seedData = [
        new Gif({
            paths: {
                preview: '/img/gifs/animation-adrian-preview.gif',
                high_resolution: '/img/gifs/animation-adrian.gif'
            },
            hearts: 0
        }),
        new Gif({
            paths: {
                preview: '/img/gifs/animation-arash-preview.gif',
                high_resolution: '/img/gifs/animation-arash.gif'
            },
            hearts: 0
        }),
        new Gif({
            paths: {
                preview: '/img/gifs/animation-jamie-preview.gif',
                high_resolution: '/img/gifs/animation-jamie.gif'
            },
            hearts: 0
        }),
        new Gif({
            paths: {
                preview: '/img/gifs/animation-chad-preview.gif',
                high_resolution: '/img/gifs/animation-chad.gif'
            },
            hearts: 0
        }),
        new Gif({
            paths: {
                preview: '/img/gifs/animation-chad-creepy-preview.gif',
                high_resolution: '/img/gifs/animation-chad-creepy.gif'
            },
            hearts: 0
        }),
        new Gif({
            paths: {
                preview: '/img/gifs/animationadrian-spin-preview.gif',
                high_resolution: '/img/gifs/animationadrian-spin.gif'
            },
            hearts: 0
        })
    ];

    // Seed Gifs if emmpty
    Gif.find({}, function(err, gifs) {

        if (!gifs.length) {
            seedData.forEach(function (elem) {
                elem.save();
            });
        }

    });

});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 3000));

app.get('/', function (req, res) {

    Gif.find({}, function(err, gifs) {

        var data = gifs || [];

        res.render('home', {title: 'HOME', data : data});

    });

});

app.use(express.static(__dirname + '/www'));

app.listen(app.get('port'), function () {

  console.log('Node app is running at localhost:' + app.get('port'));

});
