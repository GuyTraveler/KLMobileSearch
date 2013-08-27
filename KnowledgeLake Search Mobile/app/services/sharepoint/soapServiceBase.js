define(["jquery", 
		//uncaught depends
		"extensions"], 
	function ($) {
    var soapServiceBase = function (siteUrl, serviceName) {
        var self = this,
            jsonTextPropertyName = "value";
        
        self.serviceUrl = siteUrl;
        
        if (!siteUrl.endsWith('/')) {
            self.serviceUrl += "/";
        }
        
        self.serviceUrl += "_vti_bin/" + serviceName + ".asmx";
   
        self.loadSoapTemplate = function (methodName) {
            var url = "app/services/sharepoint/soapTemplates/" + serviceName + "/" + methodName + ".xml";
            return $.get(url);
        }
           
        self.executeSoapMethod = function (methodName, parameters) {
            var soapDfd = $.Deferred();
			
			self.loadSoapTemplate(methodName)
                .done(function (template) {
                    var $soap = typeof template === 'string' ? template : (new XMLSerializer()).serializeToString(template);
                        parm,
                        postData,
						parmValue;
                    
                    if (parameters) {
                        for (var i = parameters.length - 1; i >= 0; i--) {
                            parm = parameters[i];
							parmValue = parm.value != null ? parm.value : "";
                            $soap = $soap.replace("{" + parm.key + "}", parmValue);
                        }
                    }
                    
					postData = $soap;
                    
					system.logVerbose("posting SOAP request to " + self.serviceUrl);
					
                    $.ajax({
                        url: self.serviceUrl,
                        async: true,
                        type: "POST",
                        cache: false,
                        processData: false,
                        contentType: "text/xml; charset='utf-8'",
                        data: postData,
                        dataType: "xml",
                        xhrFields: { withCredentials: true },
                        success: function (result, textStatus, jqXHR) {
                            var resultJson;
                            
                            system.logVerbose("Successful ajax service call: " + serviceName + "." + methodName);
                            
                            resultJson = self.soapToJson(methodName, result);
                            
                            soapDfd.resolve(resultJson, textStatus, jqXHR);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            system.logWarning("Failed ajax service call: " + serviceName + "." + methodName + " with status: " + textStatus);
                            system.logVerbose("Error status :" + textStatus);  
                            system.logVerbose("Error type :" + errorThrown);  
                            system.logVerbose("Error message :" + XMLHttpRequest.responseXML); 
                            system.logVerbose("Error statustext :" + XMLHttpRequest.statusText); 
                            system.logVerbose("Error request status :" + XMLHttpRequest.status); 
                            
                            soapDfd.reject(XMLHttpRequest, $soap, errorThrown);
                        },
                        complete: function (jqXHR, textStatus) {
                            system.logVerbose("Completed ajax service call: " + serviceName + "." + methodName + " with status: " + textStatus);
                        }
                    });
                })
                .fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    var message = "Failed to acquire SOAP template for " + serviceName + "." + methodName;
                    
                    system.logWarning(message);
                    system.logVerbose("Error status :" + textStatus);  
                    system.logVerbose("Error type :" + errorThrown);  
                    system.logVerbose("Error message :" + XMLHttpRequest.responseXML); 
                    system.logVerbose("Error statustext :" + XMLHttpRequest.statusText); 
                    system.logVerbose("Error request status :" + XMLHttpRequest.status); 
                    
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
            
            system.logVerbose("FULLY PARSED JSON OBJECT: " + JSON.stringify(responseJson));
            
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