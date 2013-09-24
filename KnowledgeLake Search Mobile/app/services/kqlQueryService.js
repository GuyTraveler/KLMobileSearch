define(["services/soapQueryServiceBase"], 
    function (soapQueryServiceBase) {
        
        var kqlQueryService = function (siteUrl) {
            var self = this,
                //v0.1:  only returns Title, LastModifiedTime and Path right now.  We don't need any else!
                keywordTemplate = "<QueryPacket><Query><Context><QueryText type=\"STRING\">{clause} IsDocument:\"true\"</QueryText></Context><Range><Count>{maxResults}</Count></Range><TrimDuplicates>{trimDuplicates}</TrimDuplicates></Query></QueryPacket>",
				massageKeyword = function (keyword) {
					//TODO: the escape here might cause issues.  currently, if it's not there '& 'and '<' are problems
					return "\"" + $.trim(escape(keyword.encodeXML())) + "\""
                };
            
			self.prototype = Object.create(soapQueryServiceBase.prototype);
        	soapQueryServiceBase.call(self, siteUrl, keywordTemplate, massageKeyword);
			
            
            return self;
        };
                
        return kqlQueryService;
    });