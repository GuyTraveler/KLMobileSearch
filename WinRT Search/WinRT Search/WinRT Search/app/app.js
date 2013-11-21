define(["/app/config.js"], function (config) {
    requirejs.config(config);

    require(["viewmodels/mainapplicationviewmodel"],
        function (mainappviewmodel) {

            ko.applyBindings(new mainappviewmodel());

    });
});