define([], function () {
    var myVm = function () {
        var self = this;
        self.currentViewModel = ko.observable();
        self.currentView = ko.observable();

        self.loadView = function (viewToload) {
            var v = '/app/views/' + viewToload + 'view.html';
            var vm = 'viewmodels/' + viewToload + 'viewmodel';
            $.get(v, function (loadedData) {
                self.currentView(loadedData);

                require([vm],function(loadedViewModel){
                    ko.applyBindings(new loadedViewModel(), document.getElementById("content"));
                });

                
            });
           
        };
        return self;
    };
    return myVm;
});