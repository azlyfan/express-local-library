var express = require("express");
var router = express.Router();

router.get('/:filename', function(req, res, next) {

	res.render(req.params.filename, {title: req.params.filename});
});

module.exports = router;