var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GrantSchema = new Schema({
	name: String,
	email: String,
	phone: String,
	department: String,
	summary: String,
	timeline: String,
	images: [String]
});

module.exports = mongoose.model('Grant', GrantSchema);