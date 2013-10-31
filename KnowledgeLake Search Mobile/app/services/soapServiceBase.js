define(["jquery", 
		"application",
		"logger",
		//uncaught depends
		"extensions"], 
	function ($, application, logger) {
    var soapServiceBase = function (site, serviceName, httpService) {
        var self = this,
            jsonTextPropertyName = "value";
        
        self.serviceUrl = site.url;
        
        if (!site.url.endsWith('/')) {
            self.serviceUrl += "/";
        }
        
        self.serviceUrl += "_vti_bin/" + serviceName + ".asmx";
   
        self.loadSoapTemplate = function (methodName) {
            var url = "app/services/soapTemplates/" + serviceName + "/" + methodName + ".xml";
            return httpService.get(url);
        }
           
        self.executeSoapMethodAsync = function (methodName, parameters) {
            var soapDfd = $.Deferred(),
				templatePromise = self.loadSoapTemplate(methodName);
            
			templatePromise.done(function (template) {
                var xhrPromise,
					$soap = typeof template === 'string' ? template : (new XMLSerializer()).serializeToString(template),
                    parm,
					parmValue;
                
                if (parameters) {
                    for (var i = parameters.length - 1; i >= 0; i--) {
                        parm = parameters[i];
						parmValue = parm.value != null ? parm.value : "";
                        $soap = $soap.replaceAll("{" + parm.key + "}", parmValue);
                    }
                }
                
				logger.logVerbose("posting SOAP request to " + self.serviceUrl);

                xhrPromise = httpService.xhr({
                    url: self.serviceUrl,
                    async: !window.App.os.ios,  //TODO: how to make async on iphone?
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: "text/xml; charset='utf-8'",
                    data: $soap,
                    dataType: "xml",
                    xhrFields: { withCredentials: true },
					timeout: application.ajaxTimeout
                }, site);
				
				xhrPromise.done(function (result, textStatus, jqXHR) {
                    var resultJson;
                    
                    logger.logVerbose("Successful ajax service call: " + serviceName + "." + methodName);
                    
                    resultJson = self.soapToJson(methodName, result);
                    
                    soapDfd.resolve(resultJson, textStatus, jqXHR);
                });
				
				xhrPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    logger.logWarning("Failed ajax service call: " + serviceName + "." + methodName + " with status: " + textStatus);
                    logger.logVerbose("Error status :" + textStatus);  
                    logger.logVerbose("Error type :" + errorThrown);  
                    logger.logVerbose("Error message :" + XMLHttpRequest.responseXML); 
                    logger.logVerbose("Error statustext :" + XMLHttpRequest.statusText); 
                    logger.logVerbose("Error request status :" + XMLHttpRequest.status); 
                    
                    soapDfd.reject(XMLHttpRequest, $soap, errorThrown);
                });
				
				xhrPromise.always(function (jqXHR, textStatus) {
                    logger.logVerbose("Completed ajax service call: " + serviceName + "." + methodName + " with status: " + textStatus);
                });
            });

            templatePromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                var message = "Failed to acquire SOAP template for " + serviceName + "." + methodName;
                
                logger.logWarning(message);
                logger.logVerbose("Error status :" + textStatus);  
                logger.logVerbose("Error type :" + errorThrown);  
                logger.logVerbose("Error message :" + XMLHttpRequest.responseXML); 
                logger.logVerbose("Error statustext :" + XMLHttpRequest.statusText); 
                logger.logVerbose("Error request status :" + XMLHttpRequest.status); 
                
				soapDfd.reject(XMLHttpRequest, textStatus + " " + message, errorThrown);                 
            });
        
			return soapDfd;
		}
        
        //converts a SOAP packet to a JSON object
        self.soapToJson = function(methodName, soap) {
            var responseNodeName = methodName + "Response",
                responseJson = {};
            
            $(soap).find(responseNodeName).each(function (i, root) {
                responseJson[jsonTextPropertyName] = $(root).clone().children().remove().end().text();
                
                $.each($(this).children(), function(j, elem) {
                    self.parseXmlElementToJson(responseJson, elem);
                });            
            });
            
            logger.logVerbose("FULLY PARSED JSON OBJECT: " + JSON.stringify(responseJson));
            
            return responseJson;
        }
        
        //recursive method to translate SOAP elements to a JSON object
        self.parseXmlElementToJson = function (parentObject, elem) {
			var tagName = elem.tagName,
				counter = 0;
			
			//if this property name exists already, start appending a number to it...
			if (typeof parentObject[tagName] !== 'undefined') {
				while (typeof parentObject[tagName] !== 'undefined') {
					++counter;
					tagName = elem.tagName + counter;
				}
            }

            parentObject[tagName] = {};			
            parentObject[tagName][jsonTextPropertyName] = $(elem).clone().children().remove().end().text();
            
            $.each(elem.attributes, function(i, att) {
				counter = 0;
				
				//if this property name exists already, start appending a number to it...
				if (typeof parentObject[tagName][att.name] !== 'undefined') {				
					while (typeof parentObject[tagName][att.name + counter] !== 'undefined') 
						++counter;
					
					parentObject[tagName][att.name + counter] = att.value;
                }
				else {
                	parentObject[tagName][att.name] = att.value;                                                 
				}
            });
            
            $.each($(elem).children(), function (j, childElem) {
                self.parseXmlElementToJson(parentObject[tagName], childElem);
            });  
        }
       
        return self;
    };
    
    return soapServiceBase;
});