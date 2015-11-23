var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkerSchema = new Schema({
	name: String,
	email: String,
	phone: String,
	department: String,
	skills: {
		type:Array
	},
	bio: String,
	image: String,
	status: {
		type: String,
		default: 'pending'
	}
});

module.exports = mongoose.model('Worker', WorkerSchema);