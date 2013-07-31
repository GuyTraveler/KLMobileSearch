define(["framework/logLevel", "i18n!nls/strings"], function (logLevel, strings) {
    var system = function() {
        var self = this;
        
        self.logLevel = logLevel.Error;
        self.strings = strings;
      
        self.setLogLevel = function (level) {
            self.logLevel = level;
        }
        
        self.logVerbose = function (msg) {
            var log = self.logLevel <= logLevel.Verbose;
            
            if (log) console.log(msg);
            
            return log;
        },
        self.logDebug = function (msg) {
            var log = self.logLevel <= logLevel.Debug;
            
            if (log) console.debug(msg);
            
            return log;
        },
        self.logWarning = function (msg) {
            var log = self.logLevel <= logLevel.Warn;
            
            if (log) console.warn(msg);
            
            return log;  
        },
        self.logError = function (msg) {
            var log = self.logLevel <= logLevel.Error;
            
            if (log) console.error(msg);
            
            return log;
        },
        self.logFatal = function (msg) {
            var log = self.logLevel <= logLevel.Fatal;
            
            if (log) console.error(msg);
            
            return log;
        }
        
        self.isRunningInSimulator = function () {
            // device uuids for simulated devices
            var iPhone = "e0101010d38bde8e6740011221af335301010333";
            var iPhone5 = "e0101010d38bde8e6740011221af335301010333";
            var iPad = "e0101010d38bde8e6740011221af335301010333";
            var Android = "e0908060g38bde8e6740011221af335301010333";
            var AndroidTablet = "e0101010d38bde8e6740011221af335301010333";
                      
            // current device uuid
            var deviceUUID = device.uuid;
            
            if(deviceUUID == iPhone ||
                deviceUUID == iPhone5 ||
                deviceUUID == iPad ||
                deviceUUID == Android ||
                deviceUUID == AndroidTablet)
            {
                return true;
            }
            
            return false;
        }
    
        
        return self;
    };
    
    return new system();
});