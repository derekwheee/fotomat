var express = require('express'),
    exphbs  = require('express-handlebars'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
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
                preview: 'https://fotomat.herokuapp.com/img/gifs/animation-adrian-preview.gif',
                high_resolution: 'https://fotomat.herokuapp.com/img/gifs/animation-adrian.gif'
            },
            hearts: 0
        }),
        new Gif({
            paths: {
                preview: 'https://fotomat.herokuapp.com/img/gifs/animation-arash-preview.gif',
                high_resolution: 'https://fotomat.herokuapp.com/img/gifs/animation-arash.gif'
            },
            hearts: 0
        }),
        new Gif({
            paths: {
                preview: 'https://fotomat.herokuapp.com/img/gifs/animation-jamie-preview.gif',
                high_resolution: 'https://fotomat.herokuapp.com/img/gifs/animation-jamie.gif'
            },
            hearts: 0
        }),
        new Gif({
            paths: {
                preview: 'https://fotomat.herokuapp.com/img/gifs/animation-chad-preview.gif',
                high_resolution: 'https://fotomat.herokuapp.com/img/gifs/animation-chad.gif'
            },
            hearts: 0
        }),
        new Gif({
            paths: {
                preview: 'https://fotomat.herokuapp.com/img/gifs/animation-chad-creepy-preview.gif',
                high_resolution: 'https://fotomat.herokuapp.com/img/gifs/animation-chad-creepy.gif'
            },
            hearts: 0
        }),
        new Gif({
            paths: {
                preview: 'https://fotomat.herokuapp.com/img/gifs/animationadrian-spin-preview.gif',
                high_resolution: 'https://fotomat.herokuapp.com/img/gifs/animationadrian-spin.gif'
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

    var data,
        criticalCss = process.env.NODE_ENV === 'production' ? fs.readFileSync('./static/css/critical.css') : '/* This is empty in dev */';

    Gif.find({}, function(err, gifs) {

        data = gifs || [];
        res.render('../dist/views/home', {title: 'HOME', data : data, criticalCss: criticalCss});

    });

});

app.get('/:id', function (req, res) {

    var data,
        criticalCss = process.env.NODE_ENV === 'production' ? fs.readFileSync('./static/css/critical.css') : '/* This is empty in dev */';

    Gif.find({}, function(err, gifs) {

        data = gifs || [];

        Gif.findById(req.params.id, function (err, gif) {

            try {
                res.render('../dist/views/home', {title: 'HOME', id : gif._id, paths : gif.paths, data : data, criticalCss: criticalCss});
            } catch (err) {
                res.status(404).render('../dist/views/404', {title: '404'});
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

app.listen(app.get('port'), function () {

  console.log('Node app is running at localhost:' + app.get('port'));

});
