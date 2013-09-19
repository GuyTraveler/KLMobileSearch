define([], function () {
	return {
		mergeUserNameParts: function (userName, domain) {
			return (userName || "") + "@" + (domain || "");
		},
		parseUserNameParts: function (userNameString) {
			userNameString = userNameString || "";
			
			if (userNameString.indexOf("@") > -1) {
				return [
					userNameString.substring(0, userNameString.indexOf("@")),
					userNameString.substring(userNameString.indexOf("@") + 1)
				];
            }
			else if (userNameString.indexOf("\\") > -1) {
				return [					
					userNameString.substring(userNameString.indexOf("\\") + 1),
					userNameString.substring(0, userNameString.indexOf("\\"))
				];
            }
			else {
				return [
					userNameString, 
					""
				];
            }
        }
    };
});