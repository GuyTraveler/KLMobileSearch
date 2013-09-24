define(["services/soapQueryServiceBase"], 
    function (soapQueryServiceBase) {
        
        var sqlQueryService = function (siteUrl) {
            var self = this,
                //v0.1:  only returns Title, LastModifiedTime and Path right now.  We don't need any else!
                keywordTemplate = "<QueryPacket><Query><Context><QueryText type=\"MSSQLFT\"><![CDATA[SELECT \"Title\",\"LastModifiedTime\",\"Path\" FROM SCOPE() WHERE (CONTAINS('{clause}') AND IsDocument = TRUE) ]]></QueryText></Context><Range><Count>{maxResults}</Count></Range><TrimDuplicates>{trimDuplicates}</TrimDuplicates></Query></QueryPacket>",
            	massageKeyword = function (keyword) {
					return "\"" + $.trim(keyword.encodeXMLWithoutQuotes()) + "\"";
                };
			
			self.prototype = Object.create(soapQueryServiceBase.prototype);
        	soapQueryServiceBase.call(self, siteUrl, keywordTemplate, massageKeyword);
            
            return self;
        };
                
        return sqlQueryService;
    });