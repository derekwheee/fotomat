var express = require('express');
    app = express();

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/www'));

var server = app.listen(app.get('port'), function () {

  console.log("Node app is running at localhost:" + app.get('port'));

});
