var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require("async");

// Display list of all Authors
exports.author_list = function(req, res)  {
	Author.find().exec(function(err, data) {
		if (err) { return next(err); }
		res.render("author_list", {title:"Author list", author_list: data});

    });
}

// Display detail page for a specific Author
exports.author_detail = function(req, res, next)  {
	async.parallel ({
        get_author: function(callback){
            Author.findById(req.params.id).exec(callback);
        },
        get_book_list: function(callback) {
            Book.find ({author: req.params.id}).exec(callback);
        }
    }, function (err, results) {
        if (err) {return next(err);}
        res.render('author_detail', {author: results.get_author, book_list:results.get_book_list})
    });
}

// Display Author create form on GET
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET
exports.author_delete_get = function(req, res) {
    async.parallel ({
        get_author: function(callback){
            Author.findById(req.params.id).exec(callback);
        },
        get_book_list: function(callback) {
            Book.find ({author: req.params.id}).exec(callback);
        }
    }, function (err, results) {
        if (err) {return next(err);}
        
        res.render('author_delete', 
            { author: results.get_author, book_list:results.get_book_list})
    });
};

// Handle Author delete on POST
exports.author_delete_post = function(req, res) {
    async.parallel ({
        get_author: function(callback){
            Author.findById(req.params.id).exec(callback);
        },
        get_book_list: function(callback) {
            Book.find ({author: req.params.id}).exec(callback);
        }
    }, function (err, results) {
        if (err) {return next(err);}

        if (results.get_book_list.length > 0) {
            res.render('author_delete', 
            { author: results.get_author, book_list:results.get_book_list});

        }
        else {
            Author.deleteOne({_id: req.params.id}, function(err, result) {
                if (err) return next(err);
                res.redirect("/catalog/authors");
            
            });
        }
        
        
    });
};

// Display Author update form on GET
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};