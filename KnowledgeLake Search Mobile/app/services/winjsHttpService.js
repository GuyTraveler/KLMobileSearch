define(["jquery",
        "domain/credentialType"],
function ($, credentialType) {
    var winjsHttpService = function () {
        var self = this;

        self.xhr = function (options, site) {
            var dfd = $.Deferred(),
                winJsOptions;

            //map JQuery to WinJS options
            winJsOptions = {
                url: options.url,
                type: options.type,
                user: null,
                password: null,
                headers: options.headers,
                data: options.data
            };

            winJsOptions.headers = winJsOptions.headers || {};
            
            if (site && site.credential && site.credential.credentialType == credentialType.ntlm && site.credential.fullUserName()) {
                winJsOptions.user = site.credential.fullUserName();
                winJsOptions.password = site.credential.password;

                if (!winJsOptions.password)
                    winJsOptions.password = "somepassword";
            }
            else {
                winJsOptions.user = "johndoe";
                winJsOptions.password = "somepassword";
            }

            if (options.contentType) {
                winJsOptions.headers['Content-Type'] = options.contentType;
            }

            if (options.dataType) {
                var dt = options.dataType.toLowerCase();

                if (dt === 'xml') {
                    winJsOptions.responseType = "document";
                }
                else if (dt === 'html' || dt === 'text') {
                    winJsOptions.responseType = "text";
                }
                else if (dt === 'json') {
                    winJsOptions.responseType = 'json';
                }
                else {
                    winJsOptions.responseType = dt;
                }
            }

            //map preprocessor function
            if (typeof options.beforeSend === 'function') {
                options.customRequestInitializer = options.beforeSend;
            }
    
            //end JQuery to WinJS mappings
                                   
            WinJS.xhr(winJsOptions).done(
                function completed(request) {
                    //resolve in the same manner as jquery.ajax
                    dfd.resolve(request.response, request.statusText, request);
                },
                function error(request) {
                    //map expected jquery response properties
                    var XMLHttpRequest = request,
	                    textStatus = request.statusText,
	                    errorThrown = {
	                        message: request.statusText,
	                        response: request.statusText
	                    };

                    XMLHttpRequest.error = request.status;

                    dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                });

            return dfd.promise();
        }

        self.get = function (url, site) {
            return self.xhr({
                url: url,
                type: "GET",
            }, site);
        }

        self.post = function (url, data, site) {
            return self.xhr({
                url: url,
                type: "POST",
                data: data
            }, site);
        }

        return self;
    };

    return new winjsHttpService();
});