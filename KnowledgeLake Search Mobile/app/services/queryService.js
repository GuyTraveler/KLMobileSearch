define(["jquery",
        "knockout",
        "system",
        "domain/keywordConjunction",
        "ISearchService"], 
    function ($, ko, system, keywordConjunction, searchService) {
        
        var queryService = function (siteUrl) {
            var self = this,
                buildKeywordClause,
                maxResults = 5000,
                //v0.1:  only returns Title, LastModifiedTime and Path right now.  We don't need any else!
                keywordTemplate = "<QueryPacket><Query><Context><QueryText type=\"MSSQLFT\"><![CDATA[SELECT \"Title\",\"LastModifiedTime\",\"Path\" FROM SCOPE() WHERE (CONTAINS('{clause}') AND IsDocument = TRUE) ]]></QueryText></Context><Range><Count>{maxResults}</Count></Range><TrimDuplicates>{trimDuplicates}</TrimDuplicates></Query></QueryPacket>";
            
            self.keywordSearch = function (keywordPhrases, conjunction, trimDuplicates) {
                var clause = buildKeywordClause(keywordPhrase, conjunction),
                    searchDfd = $.Deferred(),
                    service = new searchService(siteUrl),
                    queryXml = keywordTemplate.replace("{clause}", clause).replace("{trimDuplicates}", trimDuplicates).replace("{maxResults}", maxResults);
                
                service.QueryEx(queryXml,
                    function (result) {
                        searchDfd.resolve(result);  
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
                    
                    keywordClause = keywordPhrases;
                }
                else if (Object.prototype.toString.call(keywordPhrases) === '[object Array]') {
                    system.logVerbose("keywordPhrases is array of length: " + keywordPhrases.length);
                    
                    wordCount = keywordPhrases.length;
                                        
                    for (var i = 0; i < wordCount; i++) {
                        keywordClause = keywordClause + "\"" + keywordPhrases[i] + "\" " + conjunction + " ";
                    }
                    
                    keywordClause = $.trim(keywordClause);
                    keywordClause = keywordClause.substring(0, keywordClause.length - conjunction.length + 1);
                    keywordClause = $.trim(keywordClause);
                    
                    system.logVerbose("keywordPhrases parsed to: " + keywordClause);
                }
                
                return keywordClause;
            };
        
            
            return self;
        };
                
        return queryService;
    });