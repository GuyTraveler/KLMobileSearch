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
            
        QUnit.asyncTest("test FileTransfer transfer", function () {
            //arrange            
            var uri = "http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf";
            
            //act
            var transferPromise = FileTransfer.transfer(uri);
            
            transferPromise.done(function (result) {
                QUnit.ok(true);               
                QUnit.start();
            });
            
            transferPromise.fail(function (result) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
            
        QUnit.asyncTest("test FileTransfer getFolder", function () {
            //arrange
            var knowledgelakeDirectory = "KnowledgeLake";
            
            //act
            var getFolderPromise = FileTransfer.getFolder();
            
            getFolderPromise.done(function (result) {
                QUnit.ok(result.isDirectory);
                QUnit.equal(result.name, knowledgelakeDirectory);            
                QUnit.start();
            });
            
            getFolderPromise.fail(function (result) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
});