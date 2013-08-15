define(["jquery", "domain/result"],
    function ($, result) {
		
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
				for (relevantResult in resultsRoot) {
					resultItem = new result();
					
					//iterate each property of each result
					for (relevantResultProperty in relevantResult) {
						setResultProperty(relevantResultProperty, relevantResult, resultItem);
                    }
					
					results.push(resultItem);
                }
				
				return 
            };
			
			getResultRoot = function (json) {
				if (!json || !json.QueryExResult || !json.QueryExResult['diffgr:diffgram']) 
					return null;
				
				return json.QueryExResult['diffgr:diffgram'].Results;
            };
			
			setResultProperty = function (relevantResultProperty, relevantResult, resultItem) {
				var isIgnored = isIgnoredProperty(relevantResultProperty),
					mappedPropertyName;
				
				if (isIgnored) return;
				
				mappedPropertyName = getMappedPropertyName(relevantResultProperty)
				
				resultItem[mappedPropertyName] = relevantResult[relevantResultProperty];
				
				//properties attached to 'result' domain object
				if (mappedPropertyName == "Path") {
					resultItem.setUrl(resultItem[mappedPropertyName]);
                }
				else if (mappedPropertyName == "Title") {
					resultItem.Title = resultItem[mappedPropertyName];
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