define(["viewmodels/viewModelBase"], 
function (viewModelBase) {
    var rootViewModel = function () {
        var self = this;
                   
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
		
        return self;
    };
    
    return rootViewModel;
});