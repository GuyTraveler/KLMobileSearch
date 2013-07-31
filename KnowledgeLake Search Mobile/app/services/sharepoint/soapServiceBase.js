define(["jquery"], function ($) {
    var soapServiceBase = function (siteUrl, serviceName) {
        var self = this,
            jsonTextPropertyName = "value";
        
        self.serviceUrl = siteUrl;
        
        if (siteUrl.charAt(siteUrl.length - 1) != '/') {
            self.serviceUrl += "/";
        }
        
        self.serviceUrl += "_vti_bin/" + serviceName + ".asmx";
   
        self.loadSoapTemplate = function (methodName) {
            var url = "app/services/sharepoint/soapTemplates/" + serviceName + "/" + methodName + ".xml";
            return $.get(url);
        }
           
        self.executeSoapMethod = function (methodName, parameters, successCallback, failCallback) {
            self.loadSoapTemplate(methodName)
                .done(function (template) {
                    var xmlDoc = $.parseXML(template),
                        $soap = $(xmlDoc),
                        parm,
                        postData;
                    
                    if (parameters) {
                        for (var i = parameters.length - 1; i >= 0; i--) {
                            parm = parameters[i];
                            $soap.find(parm.key).text(parm.value);
                        }
                    }
                    
                    postData = (new XMLSerializer()).serializeToString(xmlDoc);
                    
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
                        success: function (result) {
                            var resultJson;
                            
                            system.logVerbose("Successful ajax service call: " + serviceName + "." + methodName);
                            
                            resultJson = self.soapToJson(methodName, result);
                            
                            if (typeof successCallback === 'function')
                                successCallback(resultJson);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            system.logWarning("Failed ajax service call: " + serviceName + "." + methodName + " with status: " + textStatus);
                            system.logVerbose("Error status :" + textStatus);  
                            system.logVerbose("Error type :" + errorThrown);  
                            system.logVerbose("Error message :" + XMLHttpRequest.responseXML); 
                            system.logVerbose("Error statustext :" + XMLHttpRequest.statusText); 
                            system.logVerbose("Error request status :" + XMLHttpRequest.status); 
                            
                            if (typeof failCallback === 'function')
                                failCallback(XMLHttpRequest, $soap, errorThrown);
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
                    
                    if (typeof failCallback === 'function')
                        failCallback(XMLHttpRequest, textStatus + " " + message, errorThrown);
                });
        }
        
        self.soapToJson = function(methodName, soap) {
            var responseNodeName = methodName + "Response",
                responseJson = {};
            
            $(soap).find(responseNodeName).each(function () {
                responseJson[jsonTextPropertyName] = $(this).contents().eq(0).text();
                
                $.each($(this).children(), function(i, elem) {
                    self.parseXmlElementToJson(responseJson, elem);
                });            
            });
            
            system.logVerbose("FULLY PARSED JSON object: " + JSON.stringify(responseJson));
            
            return soap;
        }
        
        self.parseXmlElementToJson = function (parentObject, elem) {
            parentObject[elem.tagName] = {};
            parentObject[elem.tagName][jsonTextPropertyName] = $(elem).contents().eq(0).text();
            
            $.each(elem.attributes, function(i, att) {
                parentObject[elem.tagName][att.name] = att.value;
                
                $.each($(this).children(), function (j, childElem) {
                    parseXmlElementToJson(parentObject[elem.tagName]);
                });                    
            });
        }
       
        return self;
    };
    
    return soapServiceBase;
});