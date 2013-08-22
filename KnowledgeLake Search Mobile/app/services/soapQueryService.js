define(["jquery",
        "knockout",
        "system",
        "domain/keywordConjunction",
        "ISearchService", 
        "services/soapParsingService"], 
    function ($, ko, system, keywordConjunction, searchService, SoapParsingService) {
        
        var soapQueryService = function (siteUrl) {
            var self = this,
                buildKeywordClause,
                maxResults = 5000,
                //v0.1:  only returns Title, LastModifiedTime and Path right now.  We don't need any else!
                keywordTemplate = "<QueryPacket><Query><Context><QueryText type=\"MSSQLFT\"><![CDATA[SELECT \"Title\",\"LastModifiedTime\",\"Path\" FROM SCOPE() WHERE (CONTAINS('{clause}') AND IsDocument = TRUE) ]]></QueryText></Context><Range><Count>{maxResults}</Count></Range><TrimDuplicates>{trimDuplicates}</TrimDuplicates></Query></QueryPacket>";
            
            self.keywordSearch = function (keywordPhrases, conjunction, trimDuplicates) {
                var clause = buildKeywordClause(keywordPhrases, conjunction),
                    searchDfd = $.Deferred(),
                    service = new searchService(siteUrl), 
                    queryXml;
                
                conjunction = conjunction ? conjunction : keywordConjunction.and;  //default to AND
                trimDuplicates = (trimDuplicates && trimDuplicates !== false) ? true : false;
                queryXml = keywordTemplate.replace("{clause}", clause).replace("{trimDuplicates}", trimDuplicates).replace("{maxResults}", maxResults);
                
                system.logVerbose("calling QueryEx with XML: " + queryXml);
                
                service.QueryEx(queryXml,
                    function (result) {
                        var soapParsingService = new SoapParsingService();
                        
                        searchDfd.resolve(soapParsingService.parseSoapJson(result));  
                    },
                    function (XMLHttpRequest, textStatus, errorThrown) {
                        searchDfd.reject(XMLHttpRequest, textStatus, errorThrown);
                    });
                
                return searchDfd.promise();
            };
            
            buildKeywordClause = function (keywordPhrases, conjunction) {
                var keywordClause = "",
                    wordCount;
                
                if (typeof keywordPhrases === 'string') {
                    system.logVerbose("keywordPhrases is string: " + keywordPhrases);
                    
                    keywordClause = "\"" + escape(keywordPhrases) + "\"";
                }
                else if (Object.prototype.toString.call(keywordPhrases) === '[object Array]') {
                    system.logVerbose("keywordPhrases is array of length: " + keywordPhrases.length);
                    
                    wordCount = keywordPhrases.length;
                                        
                    for (var i = 0; i < wordCount; i++) {
                        keywordClause = keywordClause + "\"" + escape(keywordPhrases[i]) + "\" " + conjunction + " ";
                    }
                    
                    keywordClause = $.trim(keywordClause);
                    keywordClause = keywordClause.substring(0, keywordClause.length - conjunction.length);
                    keywordClause = $.trim(keywordClause);                                       
                }
                
                system.logVerbose("keywordPhrases parsed to: " + keywordClause);
                
                return keywordClause;
            };
        
            
            return self;
        };
                
        return soapQueryService;
    });