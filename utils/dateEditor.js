"use strict";

const op = require('sequelize').Op;

const isValidDate = (date) => {
	if (Object.prototype.toString.call(date) !== "[object Date]") {
		return false;
	}

	return !isNaN(date.getTime());
};

const getStart = (date) => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const getEnd = (date) => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
};

const todayQuery = (date) => {
	return {
		time: {
			//BETWEENでの検索
			[op.between]: [ getStart(date), getEnd(date) ]
		}
	};
};

module.exports = {
	isValidDate: isValidDate,
	// getStart: getStart,
	// getEnd: getEnd,
	todayQuery: todayQuery
};