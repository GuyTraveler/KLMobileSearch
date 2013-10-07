define(["keyValuePair",
		"logLevel"], 
	function (keyValuePair, logLevel) {
		var logs = [];
		
	    return {
	        logLevel: logLevel.Error,
			maxLogSize: 1000,
			setLogLevel: function (level) {
	            this.logLevel = level;
	        },
			getLogs: function () {
				return logs;
            },
			clearLogs: function () {
				logs = [];
            },
			logVerbose: function (msg) {
	            var shouldLog = this.logLevel <= logLevel.Verbose;
	            
	            if (shouldLog) {
					console.log(msg);	
					logs.push(new keyValuePair(logLevel.Verbose, msg));
					logs.splice(0, logs.length - this.maxLogSize);
					
	            }
	            
	            return shouldLog;
	        },
	        logDebug: function (msg) {
	            var shouldLog = this.logLevel <= logLevel.Debug;
	            
	            if (shouldLog) {
					console.debug(msg);
					logs.push(new keyValuePair(logLevel.Debug, msg));
					logs.splice(0, logs.length - this.maxLogSize);
				}
	            
	            return shouldLog;
	        },
	        logWarning: function (msg) {
	            var shouldLog = this.logLevel <= logLevel.Warn;
	            
	            if (shouldLog) {
					console.warn(msg);
					logs.push(new keyValuePair(logLevel.Warn, msg));
					logs.splice(0, logs.length - this.maxLogSize);
				}
	            
	            return shouldLog;  
	        },
	        logError: function (msg) {
	            var shouldLog = this.logLevel <= logLevel.Error;
	            
	            if (shouldLog) {
					console.error(msg);
					logs.push(new keyValuePair(logLevel.Error, msg));
					logs.splice(0, logs.length - this.maxLogSize);
				}
	            
	            return shouldLog;
	        },
	        logFatal: function (msg) {
	            var shouldLog = this.logLevel <= logLevel.Fatal;
	            
	            if (shouldLog) {
					console.error(msg);
					logs.push(new keyValuePair(logLevel.Fatal, msg));
					logs.splice(0, logs.length - this.maxLogSize);
				}
	            
	            return shouldLog;
	        }			
	    };
	});