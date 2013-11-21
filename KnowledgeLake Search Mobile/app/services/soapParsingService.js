define(["jquery", "application", "logger", "domain/result"],
    function ($, application, logger, result) {
		
		var soapParsingService = function () {
			var self = this,
				getResultRoot,
				setResultProperty,
				getMappedPropertyName,
				isIgnoredProperty,
				//map of special soap element names to usable json property names
				propertyMap = [
					{
						src: 'diffgr:id',
						dest: 'id'
                	},
					{
						src: 'msdata:rowOrder',
						dest: 'order'
                    }
				],
				//soap properties to ignore
				ignoreProperties = ['value'];
			
			self.parseSoapJson = function (json) {
				var resultsRoot = getResultRoot(json),
					relevantResult,
					relevantResultProperty,
					resultItem,
					results = [];
				
				if (!resultsRoot) 
					return results;

				//iterate each result
				for (var relevantResult in resultsRoot) {
					
					if (typeof resultsRoot[relevantResult] === 'object') {											
						resultItem = new result();
						
						//iterate each property of each result
						for (var relevantResultProperty in resultsRoot[relevantResult]) {
							setResultProperty(relevantResultProperty, resultsRoot[relevantResult], resultItem);
	                    }
						
						results.push(resultItem);
					}
                }
				
				return results;
            };
			
			getResultRoot = function (json) {
				if (!json || !json.QueryExResult || !json.QueryExResult['diffgr:diffgram']) {
					logger.logDebug("results Root not found on JSON object");
					return null;
				}
				
				return json.QueryExResult['diffgr:diffgram'].Results;
            };
			
			setResultProperty = function (relevantResultProperty, relevantResult, resultItem) {
				var isIgnored = isIgnoredProperty(relevantResultProperty),
					mappedPropertyName;
				
				if (isIgnored) return;
				
				mappedPropertyName = getMappedPropertyName(relevantResultProperty)
				
				//object types will have a 'value' property hanging off of it, string types are attributes...
				if (typeof relevantResult[relevantResultProperty] === 'object')
					resultItem.metadata[mappedPropertyName] = relevantResult[relevantResultProperty].value;
				else if (typeof relevantResult[relevantResultProperty] === 'string')
					resultItem.metadata[mappedPropertyName] = relevantResult[relevantResultProperty];
				
				//properties attached to 'result' domain object
				if (mappedPropertyName == "Path") {
					resultItem.url = resultItem.metadata[mappedPropertyName];
                }
				else if (mappedPropertyName == "Title") {
					resultItem.title = resultItem.metadata[mappedPropertyName];
                }
				else if (mappedPropertyName == "LastModifiedTime") {
					resultItem.LastModifiedTime = resultItem.metadata[mappedPropertyName];
                }
			};
			
			isIgnoredProperty = function (propertyName) {
				return ignoreProperties.indexOf(propertyName) > -1;
            };
			
			getMappedPropertyName = function (propertyName) {
				
				for (var i = propertyMap.length - 1; i >= 0; i--) {
					if (propertyMap[i].src == propertyName)
						return propertyMap[i].dest;
                }
				
				return propertyName;  //default
            };
			
			return self;
        };
		
		return soapParsingService;
    });
