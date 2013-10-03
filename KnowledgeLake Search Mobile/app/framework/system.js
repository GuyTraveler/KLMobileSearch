define(["domain/keyValuePair",
		"framework/logLevel", 
		"i18n!nls/strings"], 
	function (keyValuePair, logLevel, strings) {
		var messageDisplayTime = 3000,
			isToastUp = false,
			deviceID = window.device != null && window.device.uuid != null ? window.device.uuid : "",
			logs = [];
		
	    return {
	        logLevel: logLevel.Error,
	        strings: strings,
			ajaxTimeout: 15000,
			urlContainsClaimsSignInIndicator: function (url) {
				var claimsSignInIndicators = ["wa=wsignin1.0".toUpperCase(), 
											  "_login".toUpperCase(), 
											  "Authenticate.aspx".toUpperCase()];
				if (!url) return false;
			
				testUrl = url.toUpperCase();
				
				for (var i = claimsSignInIndicators.length - 1; i >= 0; i--) {
					var indicator = claimsSignInIndicators[i];
					
					if (testUrl.indexOf(indicator) > -1) return true;
	            }
				
				return false;
	        },
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
	            }
	            
	            return shouldLog;
	        },
	        logDebug: function (msg) {
	            var shouldLog = this.logLevel <= logLevel.Debug;
	            
	            if (shouldLog) {
					console.debug(msg);
					logs.push(new keyValuePair(logLevel.Debug, msg));
				}
	            
	            return shouldLog;
	        },
	        logWarning: function (msg) {
	            var shouldLog = this.logLevel <= logLevel.Warn;
	            
	            if (shouldLog) {
					console.warn(msg);
					logs.push(new keyValuePair(logLevel.Warn, msg));
				}
	            
	            return shouldLog;  
	        },
	        logError: function (msg) {
	            var shouldLog = this.logLevel <= logLevel.Error;
	            
	            if (shouldLog) {
					console.error(msg);
					logs.push(new keyValuePair(logLevel.Error, msg));
				}
	            
	            return shouldLog;
	        },
	        logFatal: function (msg) {
	            var shouldLog = this.logLevel <= logLevel.Fatal;
	            
	            if (shouldLog) {
					console.error(msg);
					logs.push(new keyValuePair(logLevel.Fatal, msg));
				}
	            
	            return shouldLog;
	        },
			deviceUUID: deviceID,
			isRunningInSimulator: function () {
	            // device uuids for simulated devices
	            var iPhone = "e0101010d38bde8e6740011221af335301010333";
	            var iPhone5 = "e0101010d38bde8e6740011221af335301010333";
	            var iPad = "e0101010d38bde8e6740011221af335301010333";
	            var Android = "e0908060g38bde8e6740011221af335301010333";
	            var AndroidTablet = "e0101010d38bde8e6740011221af335301010333";
	                      
	            //for normal browsers
				if (!this.deviceUUID) return true;
			
	            if(this.deviceUUID === iPhone ||
	                this.deviceUUID === iPhone5 ||
	                this.deviceUUID === iPad ||
	                this.deviceUUID === Android ||
	                this.deviceUUID === AndroidTablet)
	            {
	                return true;
	            }
	            
	            return false;
	        },
			showToast: function (message) {
				var $msgbox = $("#messageBox");

				message = message || "";
				
				$msgbox.text(message);
				$msgbox.removeClass("fade-out");
				$msgbox.addClass("opaque");
				isToastUp = true;
				
				setTimeout(function () {
					$msgbox.addClass("fade-out");
					$msgbox.removeClass("opaque");
					isToastUp = false;
	            }, messageDisplayTime);
	        },
			showSoftKeyboard: function () {
				//android
				if (window.plugins && window.plugins.SoftKeyBoard) {
					window.plugins.SoftKeyBoard.show();
	            }
	        },
			hideSoftKeyboard: function () {
				//android
				if (window.plugins && window.plugins.SoftKeyBoard) {
					window.plugins.SoftKeyBoard.hide();
	            }
	        },
			isToastVisible: function() {
				return isToastUp;
	        }
	    };
	});