define(["domain/Constants",
		"framework/logLevel"], 
function (Constants, logLevel) {
    var iconConverter = function() {
        var self = this;
       
        self.majorVersionToSiteIcon = function (majorVersion) {
            if(majorVersion)
            {
                if (majorVersion >= Constants.sharePoint2013MajorVersion)
                    return "app/images/site13.png";
            }
            
            return "app/images/site10.png";
        };      
        
        self.urlToFileTypeIcon = function(url) {
            var fileTypes = ["BMP", "JPG", "JPEG", "GIF", "EML", "DOCX", "DOC", "PDF", "TIF", "TIFF",
                         "XLS", "XLSX", "PPT", "PPTX", "VSD", "VDX", "PNG", "XML", "XSL", "XPS", 
                         "TXT", "ZIP", "CHM", "MSG", "ACCDB", "RTF", "XLSM"],
                defaultIcon = "app/images/icons/ICGEN.png";
            
            if(url)
            {
                var urlComponents = url.split(".");
                
                if(urlComponents)
                {
                    var extension = urlComponents[urlComponents.length-1].toUpperCase();
                    
                    if (fileTypes.indexOf(extension) !== -1)
                        return "app/images/icons/IC" + extension + ".png";
                }
            }
            
            return defaultIcon;
        };  
		
		self.logLevelToIcon = function (level) {
			var urlFormat = "app/images/logViewer/{level}.png";
			
			return urlFormat.replace("{level}", logLevel.toLevelString(level));
        }
       
        return self;
    };
    
    return new iconConverter();
});