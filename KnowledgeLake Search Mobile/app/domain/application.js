define(["i18n!domain/nls/strings", "framework/klNavigator"], 
	function (strings, navigator) {
		var messageDisplayTime = 3000,
			isToastUp = false,
			deviceID = window.device != null && window.device.uuid != null ? window.device.uuid : "";
		
	    return {
	        strings: strings,
            navigator: new navigator(),
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
			setBusyHtml: function (html) {
			    if (window.App) {
			        window.App.loading = html;
			    }
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