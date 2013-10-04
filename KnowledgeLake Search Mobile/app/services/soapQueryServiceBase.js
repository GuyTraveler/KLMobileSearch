define(["jquery",
        "knockout",
        "application",
		"logger",
        "domain/keywordConjunction",
        "ISearchService", 
        "services/soapParsingService"], 
    function ($, ko, application, logger, keywordConjunction, searchService, SoapParsingService) {
        
        var soapQueryServiceBase = function (siteUrl, keywordTemplate, fnMassageKeyword) {
            var self = this,
                buildKeywordClause,
                maxResults = 100;  //TODO: change this to something higher once we have dynamic paging
            
            self.keywordSearchAsync = function (keywordPhrases, conjunction, trimDuplicates) {
                var clause = buildKeywordClause(keywordPhrases, conjunction),
                    searchDfd = $.Deferred(),
                    service = new searchService(siteUrl), 
                    queryXml;
                
                conjunction = conjunction ? conjunction : keywordConjunction.and;  //default to AND
                trimDuplicates = (trimDuplicates && trimDuplicates !== false) ? true : false;
                queryXml = keywordTemplate.replace("{clause}", clause).replace("{trimDuplicates}", trimDuplicates).replace("{maxResults}", maxResults);
                
				logger.logVerbose("calling QueryEx with XML: " + queryXml);
                
                service.QueryEx(queryXml)
                    .done(function (result) {
                        var soapParsingService = new SoapParsingService();
                        
                        searchDfd.resolve(soapParsingService.parseSoapJson(result));  
                    })
                    .fail(function (XMLHttpRequest, textStatus, errorThrown) {
                        searchDfd.reject(XMLHttpRequest, textStatus, errorThrown);
                    });
                
                return searchDfd.promise();
            };
            
            buildKeywordClause = function (keywordPhrases, conjunction) {
                var keywordClause = "",
                    wordCount;
                
                if (typeof keywordPhrases === 'string') {
                    logger.logVerbose("keywordPhrases is string: " + keywordPhrases);
                    
                    keywordClause = fnMassageKeyword(keywordPhrases);
                }
                else if (Object.prototype.toString.call(keywordPhrases) === '[object Array]') {
                    logger.logVerbose("keywordPhrases is array of length: " + keywordPhrases.length);
                    
                    wordCount = keywordPhrases.length;
                                        
                    for (var i = 0; i < wordCount; i++) {
                        keywordClause = keywordClause + fnMassageKeyword(keywordPhrases[i]) + " " + conjunction + " ";
                    }
                    
                    keywordClause = $.trim(keywordClause);
                    keywordClause = keywordClause.substring(0, keywordClause.length - conjunction.length);
                    keywordClause = $.trim(keywordClause);                                       
                }
                
                logger.logVerbose("keywordPhrases parsed to: " + keywordClause);
                
                return keywordClause;
            };
        
            
            return self;
        };
                
        return soapQueryServiceBase;
    });
