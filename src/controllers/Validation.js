module.exports = {
	existsOrError(value, message) {
		if (!value) throw message;
		if (value == 0) throw message;
		if (Array.isArray(value) && value.length === 0) throw message;
		if (typeof value === "string" && !value.trim()) throw message;
	},
};
