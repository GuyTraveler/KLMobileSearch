define(["framework/logLevel", "i18n!nls/strings"], function (logLevel, strings) {
    var system = function() {
        var self = this;
        
        self.logLevel = logLevel.Error;
        self.strings = strings;
      
        self.setLogLevel = function (level) {
            self.logLevel = level;
        }
        
        self.logVerbose = function (msg) {
            if (self.logLevel <= logLevel.Verbose)
                console.log(msg);
        },
        self.logDebug = function (msg) {
            if (self.logLevel <= logLevel.Debug)
                console.log(msg);
        },
        self.logWarning = function (msg) {
            if (self.logLevel <= logLevel.Warn)
                console.log(msg);    
        },
        self.logError = function (msg) {
            if (self.logLevel <= logLevel.Error)
                console.log(msg);    
        },
        self.logFatal = function (msg) {
            if (self.logLevel <= logLevel.Fatal)
                console.log(msg);    
        }
        
        return self;
    };
    
    return new system();
});