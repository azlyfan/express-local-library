var express = require("express");
var router = express.Router();

router.get('/:book/:chapter', function(req, res) {
	res.send("Wiki home page");
	console.log (req.params["book"]);
	console.log (req.params["chapter"]);
});

module.exports = router;