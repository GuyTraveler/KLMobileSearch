define(["framework/FileTransfer", 
		"system", 
		"jquery"], function (FileTransfer, system, $) {
        QUnit.module("Testing framework/FileTransfer");

        QUnit.test("test fileTransfer is up and running", function () {
            //arrange
            
            //act
                        
            //assert
            QUnit.ok(FileTransfer);
        });
            
        QUnit.test("test fileTransfer transfer", function () {
            //arrange
            var uri = "http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf";
            
            //act
            // will return a promise (will require async test)
            FileTransfer.transfer(uri);
                        
            //assert
            QUnit.ok(FileTransfer);
        });
});