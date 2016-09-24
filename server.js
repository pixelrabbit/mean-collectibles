// server.js

// BASE SETUP
// =============================================================================

var mongoose   = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017');

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
var port = process.env.PORT || 8000;        // set our port




// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});


var Item     = require('./app/models/item');


// more routes for our API will happen here
// on routes that end in /items
// ----------------------------------------------------
router.route('/items')

    // create an item (accessed at POST http://localhost:8000/api/items)
    .post(function(req, res) {
        
        var item = new Item();      // create a new instance of the item model
        item.name = req.body.name;  // set the items name (comes from the request)

        // save the item and check for errors
        item.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Item created!' });
        });
        
    })
    .get(function(req, res) {
        Item.find(function(err, items) {
            if (err)
                res.send(err);

            res.json(items);
        });
    });


// on routes that end in /items/:item_id
// ----------------------------------------------------
router.route('/items/:item_id')

    // get the item with that id (accessed at GET http://localhost:8080/api/items/:item_id)
    .get(function(req, res) {
        Item.findById(req.params.item_id, function(err, item) {
            if (err)
                res.send(err);
            res.json(item);
        });
    })
    // update the item with this id (accessed at PUT http://localhost:8080/api/items/:item_id)
    .put(function(req, res) {

        // use our item model to find the item we want
        Item.findById(req.params.item_id, function(err, item) {

            if (err)
                res.send(err);

            item.name = req.body.name;  // update the items info

            // save the item
            item.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'item updated!' });
            });

        });
    })
    // delete the item with this id (accessed at DELETE http://localhost:8080/api/items/:item_id)
    .delete(function(req, res) {
        Item.remove({
            _id: req.params.item_id
        }, function(err, item) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);




app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

require('./app/routes')(app); // pass our application into our routes

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
exports = module.exports = app; 						// expose app


















// // modules =================================================
// var express        = require('express');
// var app            = express();
// var mongoose       = require('mongoose');
// var bodyParser     = require('body-parser');
// var methodOverride = require('method-override');

// // configuration ===========================================
	
// // config files
// var db = require('./config/db');

// var port = process.env.PORT || 8000; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// // get all data/stuff of the body (POST) parameters
// app.use(bodyParser.json()); // parse application/json 
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
// app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
// app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// // routes ==================================================
// require('./app/routes')(app); // pass our application into our routes

// // start app ===============================================
// app.listen(port);	
// console.log('Magic happens on port ' + port); 			// shoutout to the user
// exports = module.exports = app; 						// expose app