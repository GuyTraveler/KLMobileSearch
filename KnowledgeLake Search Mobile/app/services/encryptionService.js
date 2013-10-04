define(["CryptoJS", "domain/Constants"], 
    function (CryptoJS, Constants) {
        
    var encryptionService = function() {
        var self = this;
        
        self.encrypt = function (password, modifier) {
            return (CryptoJS.AES.encrypt(password, window.atob(Constants.phrase) + modifier)).toString();
        };      
        
        self.decrypt = function(encryptedPassword, modifier) {
            return (CryptoJS.AES.decrypt(encryptedPassword, window.atob(Constants.phrase) + modifier)).toString(CryptoJS.enc.Utf8);            
        };  
    };
    
    return new encryptionService();
});