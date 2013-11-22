define(function () {

    if (!String.prototype.endsWith)
    {
        String.prototype.endsWith = function (suffix) {
            return suffix != null && this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }

    if (!String.prototype.startsWith)
    {
        String.prototype.startsWith = function (str) {
            return str != null && this.indexOf(str) == 0;
        };
    }

    if (!String.prototype.format)
    {
        String.prototype.format = function () {
            var args = arguments;

            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }

    if (!RegExp.quote)
    {
        RegExp.quote = function (str) {
            if (str == null)
                str = "";
            return str.replace(/([.?*+^$[\]\\(){}-])/g, "\\$1");
        };
    }

    if (!String.prototype.replaceAll)
    {
        String.prototype.replaceAll = function (replaceThis, withThis) {
            var re;

            if (replaceThis == null || withThis == null)
                return this;

            re = new RegExp(RegExp.quote(replaceThis), "g");
            return this.replace(re, withThis);
        };
    }

    if (!String.prototype.encodeXML)
    {
        String.prototype.encodeXML = function () {
            return this.replace(/&/g, '&amp;')
		           	.replace(/</g, '&lt;')
		           	.replace(/>/g, '&gt;')
		           	.replace(/"/g, '&quot;');
        };
    }

    if (!String.prototype.encodeXMLWithoutQuotes)
    {
        String.prototype.encodeXMLWithoutQuotes = function () {
            return this.replace(/&/g, '&amp;')
		           	.replace(/</g, '&lt;')
		           	.replace(/>/g, '&gt;');
        };
    }

    if (!String.prototype.encodeAngleBrackets)
    {
        String.prototype.encodeAngleBrackets = function () {
            return this.replace(/</g, '&lt;')
		           	.replace(/>/g, '&gt;');
        };
    }

    if (!String.prototype.parseBool)
    {
        String.prototype.parseBool = function () {
            return this.toUpperCase() === "TRUE";
        };
    }

    if (!String.prototype.parseConjunctionToBool)
    {
        String.prototype.parseConjunctionToBool = function () {
            return this.toUpperCase() === "AND";
        };
    }
        
    if (!Function.prototype.getParamNames)
    {
        Function.prototype.getParamNames = function (func) {
            if (typeof func !== 'function')
                return [];

            var stripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
                fnStr = func.toString().replace(stripComments, ''),
                result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);

            if (result === null) result = [];

            return result;
        }
    }

    if (!Function.prototype.getFunctionVariableName)
    {
        Function.prototype.getFunctionVariableName = function (parentObj, funcRef) {
            if (typeof funcRef !== 'function' || typeof parentObj != 'object')
                return null;

            for (var item in parentObj)
            {
                if (parentObj[item] === funcRef)
                    return item;
            }

            return null;
        }
    }

    //shim for WinJS
    if (!window.toStaticHTML)
    {
        window.toStaticHTML = function (html) {
            return html;
        }
    }
});
