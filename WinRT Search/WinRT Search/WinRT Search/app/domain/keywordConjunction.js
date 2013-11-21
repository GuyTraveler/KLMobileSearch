define([], function() {
	var andString = "And",
		orString = "Or";
	
	return {
		and: andString,
		or: orString,
		defaultConjunction: andString,
		boolToConjunction: function (bln) {
			return bln ? andString : orString;	
        }
    };
});