'use strict';
const crypto = require("crypto");

const createHash = (pass,salt) => {
	let hash = crypto.createHash('sha256');
	hash.update(pass + salt);
	return hash.digest('base64');
};

module.exports = createHash;