define([], function () {
    var urlToFileTypeIconConverter = function() {
        var self = this, 
            fileTypes = ["BMP", "JPG", "JPEG", "GIF", "EML", "DOCX", "DOC", "PDF", "TIF", "TIFF",
                         "XLS", "XLSX", "PPT", "PPTX", "VSD", "VDX", "PNG", "XML", "XSL", "XPS", 
                         "TXT", "ZIP", "CHM", "MSG", "ACCDB", "RTF", "XLSM"],
            defaultIcon = "app/images/icon/ICGEN.png";
       
        self.convert = function (url) {
            var urlComponents = url.split(".");
            
            if(urlComponents)
            {
                var extension = urlComponents[urlComponents.length-1].toUpperCase();
                
                if (fileTypes.indexOf(extension) != -1)
                    return "app/images/icons/IC" + extension + ".png";
            }
            
            return defaultIcon;
        };        
       
        return self;
    };
    
    return new urlToFileTypeIconConverter();
});