define(function () {
	
	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function(suffix) {
		    return this.indexOf(suffix, this.length - suffix.length) !== -1;
		};
	}
	
	if (!String.prototype.encodeXML) {
		String.prototype.encodeXML = function () {
			return this.replace(/&/g, '&amp;')
		           	.replace(/</g, '&lt;')
		           	.replace(/>/g, '&gt;')
		           	.replace(/"/g, '&quot;');
		};
	}
	
	if (!String.prototype.encodeAngleBrackets) {
		String.prototype.encodeAngleBrackets = function () {
			return this.replace(/</g, '&lt;')
		           	.replace(/>/g, '&gt;');
		};
	}
});