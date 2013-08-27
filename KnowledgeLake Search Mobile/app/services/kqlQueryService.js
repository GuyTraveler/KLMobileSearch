define(["jquery",
        "knockout",
        "system",
        "domain/keywordConjunction",
        "ISearchService", 
        "services/soapParsingService"], 
    function ($, ko, system, keywordConjunction, searchService, SoapParsingService) {
        
        var kqlQueryService = function (siteUrl) {
            var self = this,
                buildKeywordClause,
                maxResults = 5000,
                //v0.1:  only returns Title, LastModifiedTime and Path right now.  We don't need any else!
                keywordTemplate = "<Request AddExpandoFieldTypeSuffix=\"true\" SchemaVersion=\"15.0.0.0\" LibraryVersion=\"15.0.0.0\" ApplicationName=\".NET Library\" xmlns=\"http://schemas.microsoft.com/sharepoint/clientquery/2009\"><Actions><SetProperty Id=\"137\" ObjectPathId=\"134\" Name=\"QueryText\"><Parameter Type=\"String\"> (({clause}) AND IsDocument=\"TRUE\") </Parameter></SetProperty><ObjectPath Id=\"139\" ObjectPathId=\"138\" /><Method Name=\"Add\" Id=\"140\" ObjectPathId=\"138\"><Parameters><Parameter Type=\"String\">Title</Parameter></Parameters></Method><Method Name=\"Add\" Id=\"141\" ObjectPathId=\"138\"><Parameters><Parameter Type=\"String\">LastModifiedTime</Parameter></Parameters></Method><Method Name=\"Add\" Id=\"142\" ObjectPathId=\"138\"><Parameters><Parameter Type=\"String\">path</Parameter></Parameters></Method><ObjectPath Id=\"144\" ObjectPathId=\"143\" /><Method Name=\"ExecuteQuery\" Id=\"145\" ObjectPathId=\"143\"><Parameters><Parameter ObjectPathId=\"134\" /></Parameters></Method></Actions><ObjectPaths><Constructor Id=\"134\" TypeId=\"{80173281-fffd-47b6-9a49-312e06ff8428}\" /><Property Id=\"138\" ParentId=\"134\" Name=\"SelectProperties\" /><Constructor Id=\"143\" TypeId=\"{8d2ac302-db2f-46fe-9015-872b35f15098}\" /></ObjectPaths></Request>";
            
            self.keywordSearch = function (keywordPhrases, conjunction, trimDuplicates) {
                var clause = buildKeywordClause(keywordPhrases, conjunction),
                    searchDfd = $.Deferred(),
                    service = new searchService(siteUrl), 
                    queryXml;
                
                conjunction = conjunction ? conjunction : keywordConjunction.and;  //default to AND
                trimDuplicates = (trimDuplicates && trimDuplicates !== false) ? true : false;
                queryXml = keywordTemplate.replace("{clause}", clause).replace("{trimDuplicates}", trimDuplicates).replace("{maxResults}", maxResults);
                
                system.logVerbose("calling QueryEx with XML: " + queryXml);
                
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
                    system.logVerbose("keywordPhrases is string: " + keywordPhrases);
                    
                    keywordClause = "\"" + escape(keywordPhrases.encodeXML()) + "\"";
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
                
        return kqlQueryService;
    });