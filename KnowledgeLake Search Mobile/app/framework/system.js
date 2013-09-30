define(["framework/logLevel", "i18n!nls/strings"], function (logLevel, strings) {
	var messageDisplayTime = 3000,
		isToastUp = false;
	
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
		logVerbose: function (msg) {
            var log = this.logLevel <= logLevel.Verbose;
            
            if (log) console.log(msg);
            
            return log;
        },
        logDebug: function (msg) {
            var log = this.logLevel <= logLevel.Debug;
            
            if (log) console.debug(msg);
            
            return log;
        },
        logWarning: function (msg) {
            var log = this.logLevel <= logLevel.Warn;
            
            if (log) console.warn(msg);
            
            return log;  
        },
        logError: function (msg) {
            var log = this.logLevel <= logLevel.Error;
            
            if (log) console.error(msg);
            
            return log;
        },
        logFatal: function (msg) {
            var log = this.logLevel <= logLevel.Fatal;
            
            if (log) console.error(msg);
            
            return log;
        },
		isRunningInSimulator: function () {
            // device uuids for simulated devices
            var iPhone = "e0101010d38bde8e6740011221af335301010333";
            var iPhone5 = "e0101010d38bde8e6740011221af335301010333";
            var iPad = "e0101010d38bde8e6740011221af335301010333";
            var Android = "e0908060g38bde8e6740011221af335301010333";
            var AndroidTablet = "e0101010d38bde8e6740011221af335301010333";
                      
            //for normal browsers
			if (!window.device) return true;
			
			// current device uuid
            var deviceUUID = device.uuid;
            
            if(deviceUUID === iPhone ||
                deviceUUID === iPhone5 ||
                deviceUUID === iPad ||
                deviceUUID === Android ||
                deviceUUID === AndroidTablet)
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