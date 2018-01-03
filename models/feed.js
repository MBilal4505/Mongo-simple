const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const LinkSchema = mongoose.Schema({
link: {
	type: String,
	required: true
},
email: {
	type: String,
	required: true
},
user_id: {
	type: String,
	required: true
}
});
const Feed = module.exports = mongoose.model('Feed', LinkSchema);

module.exports.getUserById = function(id, callback){
	Feed.find({id, callback});
}

module.exports.addLink= function(newLink, callback){
			newLink.save(callback);
}