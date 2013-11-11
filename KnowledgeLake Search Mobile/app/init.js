//globals:
//**require**//
var App,
    AppLoaded,
    application;

require(["config"], function (config) {
    require.config(config);
    
    require(["jquery", 
             "knockout", 
             "kendo",   
             "application", 
			 "logger",
			 "extensions",
             "framework/logLevel",
             //load viewModel REFERENCES early here so that we don't get goofy styling issues later...
			 "viewmodels/rootViewModel",
             "viewmodels/homeViewModel",
             "viewmodels/configureSiteViewModel",
             "viewmodels/savedSearchViewModel",
             "viewmodels/searchBuilderViewModel",
             "viewmodels/resultsViewModel",
             "framework/knockout/kendoView",
			 "framework/knockout/logLevelToIcon",
			 "framework/knockout/logLevelToCss",
             "framework/knockout/urlToFileTypeIcon",
             "framework/knockout/majorVersionToSiteIcon", 
             "framework/knockout/dateTimeToLocaleString", 
             "framework/knockout/searchPropertyBuilder",
			 "framework/knockout/kendoListView",  
             "framework/knockout/kendoTouch",  
             "framework/knockout/kendoKeywordBox",
			 "framework/knockout/kendoCalendar",
			 "framework/knockout/numberValidation",
			 "framework/knockout/calendarValidation"], 
    function($, ko, kendo, application, logger, extensions, logLevel, rootViewModel) {
        var testHref = "test.html?coverage=true";                
        
        if (config.isQunit && window.location.href.indexOf(testHref) < 0) {
            window.location.href = testHref;
        }
           
        logger.setLogLevel(config.logLevel);
        window.AppLoaded = ko.observable(false);
          
        ko.applyBindings(new rootViewModel(), document.body);
                
        $(document).ready(function () {
            logger.logVerbose("DOM is ready - waiting for device"); 
       
            document.addEventListener("deviceready", function () {
                logger.logVerbose("device ready!");
								
				//TODO:  remove this in favor of a native Kendo solution once we update to a new kendo mobile version:
				//ref: http://www.icenium.com/blog/icenium-team-blog/2013/11/07/everything-hybrid-web-apps-need-to-know-about-the-status-bar-in-ios7
				var match = navigator.userAgent.match(/OS (\d)/),
					updateStatusBar = navigator.userAgent.match(/iphone|ipad|ipod/i) &&
			        				  parseInt(match[1], 10) >= 7;

			    if (updateStatusBar) {
			        document.body.style.webkitTransform = 'translate3d(0, 20px, 0)';
			    }
				
            }, false);  
        });
    });
});
