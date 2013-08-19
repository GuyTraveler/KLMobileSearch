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
            var uri = "http://www.knowledgelake.com/PublishingImages/HomepageSlides/content-out-of-chaos.jpg";
            
            //act
            var transferPromise = FileTransfer.transfer(uri);
            
            transferPromise.done(function (result) {
                QUnit.ok(result);               
                QUnit.start();
            });
            
            transferPromise.fail(function (error) {
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
            
            getFolderPromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
            
        QUnit.test("test fileTransfer convertUrlToFileName", function () {
            //arrange
            var url = "http://www.knowledgelake.com/PublishingImages/HomepageSlides/";
            var fileName = "content-out-of-chaos.jpg";
            
            //act
            var result = FileTransfer.convertUrlToFileName(url + fileName);
            
            //assert
            QUnit.equal(result, fileName);
        });
});