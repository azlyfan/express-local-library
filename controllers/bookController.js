var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async');
var mongoose = require('mongoose');

exports.index = function(req, res, next) {   
	
	async.parallel({
		book_count: function(callback) {
			Book.count(callback);
		},
		book_instance_count: function(callback) {
			BookInstance.count(callback);
		},
		book_instance_available_count: function(callback) {
			BookInstance.count({status:'Available'}, callback);
		},
		author_count: function(callback) {
			Author.count(callback);
		},
		genre_count: function(callback) {
			Genre.count(callback);
		},
	}, function(err, results) {
		res.render('index', { title: 'Local Library Home', error: err, data: results });
	});
};

// Display list of all books
exports.book_list = function(req, res, next) {

	Book.find({}, "title author ")
	.populate("author")
	.exec(function(err, list_books) {
		if (err) { return next(err); }
		res.render("book_list", {title:"Book list", book_list:list_books});

	});
};

// Display detail page for a specific book
exports.book_detail = function(req, res, next) {
	async.parallel({
		get_book: function(callback) {
			Book.findById(req.params.id).populate("author genre").exec(callback)
		},
		get_bookinstance_list: function (callback) {
			BookInstance.find({book: req.params.id}).exec(callback)
		}

	}, function (err, results) {
		if (err) 
			return next(err);

		res.render("book_detail", 
		{
			title: "Book Detail",
			book: results.get_book,
			bookinstance_list: results.get_bookinstance_list
		});

	});

};

// Display book create form on GET
exports.book_create_get = function(req, res, next) {

	async.parallel({
		get_author: function(callback) {
			Author.find().exec(callback);
		},

		get_genre: function(callback) {
			Genre.find().exec(callback);
		}
		

	}, function (err, results) {
		if(err) {return next(err);}
		res.render("book_form", 
			{title:"Create Book", 
			authors: results.get_author,
			genres: results.get_genre});
	});
};

// Handle book create on POST
exports.book_create_post = function(req, res, next) {

	req.checkBody('title', 'Title must not be empty.').notEmpty();
	req.checkBody('author', 'Author must not be empty').notEmpty();
	req.checkBody('summary', 'Summary must not be empty').notEmpty();
	req.checkBody('isbn', 'ISBN must not be empty').notEmpty();

	req.sanitize('title').escape();
	req.sanitize('author').escape();
	req.sanitize('summary').escape();
	req.sanitize('isbn').escape();
	req.sanitize('genre').escape();

	req.sanitize('title').trim();     
	req.sanitize('author').trim();
	req.sanitize('summary').trim();
	req.sanitize('isbn').trim();


	var errors = req.validationErrors();

	var book = new Book({
		title: req.body.title,
		author: req.body.author,
		summary: req.body.summary,
		isbn: req.body.isbn,
		genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre.split(",")
	});

	if (errors) {
		async.parallel({
			get_author: function(callback) {
				Author.find(callback);
			},

			get_genre: function(callback) {
				Genre.find(callback);
			}
		},
		function(err, results) {
			if (err) return next(err);

			author_list = results.get_author;
			genre_list = results.get_genre;

			for (var i = 0; i < genre_list.length; i++) {

				genre_list[i].checked = false;
				if (book.genre.indexOf(genre_list[i]._id) > -1) {
					genre_list[i].checked = true;
				}					
			}

			res.render("book_form", 
				{title: "Create Book", errors: errors,
				authors: author_list, genres: genre_list, book: book });

		});
	}

	else {
		book.save(function(err) {
			if (err) return next(err);
			res.redirect(book.url);
		});
	}
	
};

// Display book delete form on GET
exports.book_delete_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST
exports.book_delete_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET
exports.book_update_get = function(req, res, next) {

	req.sanitize('id').escape();
	req.sanitize('id').trim();


	async.parallel({
		get_book: function(callback) {
			Book.findById(req.params.id).exec(callback)
		},

		get_author: function(callback) {
			Author.find(callback);
		},

		get_genre: function(callback) {
			Genre.find(callback);
		}
	},
	function(err, results) {
		if (err) return next(err);

		genre_list = results.get_genre;

		for (var i = 0; i < genre_list.length; i++) {

			genre_list[i].checked = false;
			if (results.get_book.genre.indexOf(genre_list[i]._id) > -1) {
				genre_list[i].checked = true;
			}					
		}

		res.render("book_form", 
			{title: 'Update Book',
			authors: results.get_author, genres: genre_list, book: results.get_book });

	});

};

// Handle book update on POST
exports.book_update_post = function(req, res, next) {

	req.checkBody('title', 'Title must not be empty.').notEmpty();
	req.checkBody('author', 'Author must not be empty').notEmpty();
	req.checkBody('summary', 'Summary must not be empty').notEmpty();
	req.checkBody('isbn', 'ISBN must not be empty').notEmpty();

	req.sanitize('title').escape();
	req.sanitize('author').escape();
	req.sanitize('summary').escape();
	req.sanitize('isbn').escape();
	req.sanitize('genre').escape();

	req.sanitize('title').trim();     
	req.sanitize('author').trim();
	req.sanitize('summary').trim();
	req.sanitize('isbn').trim();


	var errors = req.validationErrors();

	var book = new Book({
		title: req.body.title,
		author: req.body.author,
		summary: req.body.summary,
		isbn: req.body.isbn,
		genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre.split(","),
		_id:req.params.id
	});

	if (errors) {
		async.parallel({
			get_author: function(callback) {
				Author.find(callback);
			},

			get_genre: function(callback) {
				Genre.find(callback);
			}
		},
		function(err, results) {
			if (err) return next(err);

			author_list = results.get_author;
			genre_list = results.get_genre;

			for (var i = 0; i < genre_list.length; i++) {

				genre_list[i].checked = false;
				if (book.genre.indexOf(genre_list[i]._id) > -1) {
					genre_list[i].checked = true;
				}					
			}

			res.render("book_form", 
				{title: "Create Book", errors: errors,
				authors: author_list, genres: genre_list, book: book });

		});
	}

	else {

		Book.updateOne({_id: req.params.id}, book, function(err) {
			if (err) return next(err);
			res.redirect(book.url);
		});
	}
};