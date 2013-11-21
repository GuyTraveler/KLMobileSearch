// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                window.onload = whenPageLoads();

                //addSite
                var settingsPane = Windows.UI.ApplicationSettings.SettingsPane.getForCurrentView();
                settingsPane.addEventListener("commandsrequested", onCommandsRequested);

            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();

    function whenPageLoads() {
        var mdFinePrint = "Please register your product with KnowledgeLake. We are doing this to monitor what products our customers are using and how high a demand they are within our customer base.";
        var mdTitle = "Register now with KnowledgeLake Search";
        var md = new Windows.UI.Popups.MessageDialog(mdFinePrint, mdTitle);

        document.getElementById("registerFlyout").addEventListener("click",
            //Buttons
            md.commands.append(new Windows.UI.Popups.UICommand("Register", function (command) {
                registerFlyout.winControl.show(anchr, "right");
            })));
            md.commands.append(new Windows.UI.Popups.UICommand("Skip", function (command) {
                //Navigate to KnowledgeLake Search  
                document.getElementById("registerFlyout").winControl.hide();
            })
        );
        md.showAsync();
    }

    //flyouts
    function onSettingsCommand() {
        addSiteFlyout.winControl.show(anchr, "right");
        selectSiteFlyout.winControl.show(anchr, "right");
    }
    //flyouts
    function onCommandsRequested(eventArgs) {
        var settingsCommandAdd = new Windows.UI.ApplicationSettings.SettingsCommand("addSite", "Add Site", onSettingsCommand);
        eventArgs.request.applicationCommands.append(settingsCommandAdd);
        var settingsCommandSelect = new Windows.UI.ApplicationSettings.SettingsCommand("selectSite", "Select Site", onSettingsCommand);
        eventArgs.request.applicationCommands.append(settingsCommandSelect);
    }

})();
