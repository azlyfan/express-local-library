var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("test", { title: "Test", data:"Hello from Quoc"});
});

module.exports = router;