var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
	name: String,
	email: String,
	phone: String,
	department: String,
	numHours: String,
	perHour: String,
	description: String,
	worker: {
		type: String,
		default: 'general'
	}
});

module.exports = mongoose.model('Request', RequestSchema);