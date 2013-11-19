define([], function() {
   
    var credential = function (credentialType, userName, password, domain) {
        var self = this;
        
        self.credentialType = credentialType;
        self.userName = userName;
        self.password = password;
        self.domain = domain;

        self.fullUserName = function () {
            return self.userName && self.domain ? self.userName + "@" + self.domain : "";
        }

        return self;
    };

    credential.prototype.fromJSON = function (object) {
        return new credential(object.credentialType, object.userName, object.password, object.domain);
    }
    
    return credential;
});