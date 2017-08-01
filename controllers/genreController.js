var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require("async");

// Display list of all Genre
exports.genre_list = function(req, res, next) {
    Genre.find().exec(function(err, data) {
		if (err) { return next(err); }
		res.render("genre_list", {title:"Genre list", genre_list: data});

    });
};

// Display detail page for a specific Genre
exports.genre_detail = function(req, res, next) {

	async.parallel({
		get_genre: function (callback) {
			Genre.find({_id: req.params.id}).exec(callback);
    	},
		get_book_list: function(callback){
			Book.find({genre: req.params.id}).exec(callback);
		}
	},
		function (err, results) {
			if (err) {return next(err);}
			res.render("genre_detail", 
				{title:"Genre Detail", genre: results.get_genre[0], book_list: results.get_book_list});
		}
	);
};

// Display Genre create form on GET
exports.genre_create_get = function(req, res) {
    res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST
exports.genre_create_post = function(req, res, next) {

	req.checkBody("name", "Genre name required").notEmpty();

	req.sanitize().escape();
	req.sanitize().trim();

	var errors = req.validationErrors();

	var genre = new Genre(
      { name: req.body.name }
    );

    if (errors) {
    	res.render("genre_form", {title: "Create Genre", genre: genre, errors: errors});
    }
    else {
		Genre.findOne({name: req.body.name}).exec(function (err, found_genre) {
			console.log("found_genre: " + found_genre);
			if (err) {return next (err);}

			if (found_genre) {
				res.redirect(found_genre.url);
			}
			else {
				genre.save(function (err) {
					if (err) {return next(err);}
					res.redirect(genre.url);
				});
			}


		});
    }
};

// Display Genre delete form on GET
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};