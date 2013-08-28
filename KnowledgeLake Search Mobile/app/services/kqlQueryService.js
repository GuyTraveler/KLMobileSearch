define(["services/soapQueryServiceBase"], 
    function (soapQueryServiceBase) {
        
        var kqlQueryService = function (siteUrl) {
            var self = this,
                //v0.1:  only returns Title, LastModifiedTime and Path right now.  We don't need any else!
                keywordTemplate = "<QueryPacket><Query><Context><QueryText type=\"STRING\">{clause} IsDocument:\"true\"</QueryText></Context><Range><Count>{maxResults}</Count></Range><TrimDuplicates>{trimDuplicates}</TrimDuplicates></Query></QueryPacket>";
            
			self.prototype = Object.create(soapQueryServiceBase.prototype);
        	soapQueryServiceBase.call(self, siteUrl, keywordTemplate);
			
            
            return self;
        };
                
        return kqlQueryService;
    });