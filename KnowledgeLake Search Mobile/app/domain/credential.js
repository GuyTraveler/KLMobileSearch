define([], function() {
   
    var credential = function (type, userName, password, domain) {
        var self = this;
        
        self.credentialType = type;
        self.userName = userName;
        self.password = password;
        self.domain = domain;

        return self;
    };       
    
    return credential;
});