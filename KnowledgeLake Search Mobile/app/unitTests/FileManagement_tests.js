//explictly request the actual FileManagment
define(["framework/FileManagement", 
		"system", 
		"jquery"], function (File, system, $) {
        QUnit.module("Testing framework/FileManagement");

        QUnit.test("test fileSystem is up and running", function () {
            //arrange
            
            //act
                        
            //assert
            QUnit.ok(File);
            
            QUnit.ok(File.fileSystem);
        });
    
        QUnit.asyncTest("test file exists if file exists", function () {
            //arrange
            var filePath = "test.txt";
            var testData = "test data";
            
            var writePromise = File.Write(filePath, testData);
            
            writePromise.done(function (result) {
                //act
                var existsPromise = File.Exists(filePath);
                
                //assert
                existsPromise.done(function (result) {
                    QUnit.ok(true);
                    QUnit.start();
                });
                
                existsPromise.fail(function (result) {
                    QUnit.ok(false);
                    QUnit.start();
                });
            });
            
            writePromise.fail(function (result) {
                QUnit.ok(false);
            });
        });
    
        QUnit.asyncTest("test file exists if file does not exist", function () {
            //arrange
            var filePath = "test.txt";
            
            var deletePromise = File.Delete(filePath);
            
            deletePromise.done(function (result) {
                //act
                var existsPromise = File.Exists(filePath);
                
                //assert
                existsPromise.done(function (result) {                    
                    QUnit.equal(result, false);
                    QUnit.start();
                });
                
                existsPromise.fail(function (result) {
                    QUnit.ok(false);
                    QUnit.start();
                });
            });
            
            deletePromise.fail(function (result) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
    
        QUnit.asyncTest("test file read if file exists / test file write successful", function () {
            //arrange
            var filePath = "test.txt";
            var testData = "test data";
            
            var writePromise = File.Write(filePath, testData);
            
            writePromise.done(function (result) {
                QUnit.ok(result);
                
                //act
                var readPromise = File.Read(filePath);
                
                //assert
                readPromise.done(function (result) {
                    QUnit.equal(result, testData);
                    QUnit.start();
                });
                
                readPromise.fail(function (result) {
                    QUnit.ok(false);
                    QUnit.start();
                });
            });
            
            writePromise.fail(function (result) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
    
        QUnit.asyncTest("test file read if file does not exist", function () {
            //arrange
            var filePath = "test.txt";
            
            var deletePromise = File.Delete(filePath);
            
            deletePromise.done(function (result) {
                //act
                var readPromise = File.Read(filePath);
                
                //assert
                readPromise.done(function (result) {
                    QUnit.ok(false);
                    QUnit.start();
                });
                
                readPromise.fail(function (result) {
                    QUnit.ok(true);
                    QUnit.start();
                });
            });
            
            deletePromise.fail(function (result) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
    
        QUnit.asyncTest("test file delete if file exists", function () {
            //arrange
            var filePath = "test.txt";
            var testData = "test data";
            
            var writePromise = File.Write(filePath, testData);
            
            writePromise.done(function (result) {
                //act
                var deletePromise = File.Delete(filePath);
                
                //assert
                deletePromise.done(function (result) {
                    QUnit.ok(true);
                    QUnit.start();
                });
                
                deletePromise.fail(function (result) {
                    QUnit.ok(false);
                    QUnit.start();
                });
            });
            
            writePromise.fail(function (result) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
    
    
        /*QUnit.asyncTest("test file exists if fileSystem is null", function () {
            //arrange
            var filePath = "test.txt";
            File.fileSystem = null;
            //act
            var existsPromise = File.Exists(filePath);
            //assert
            existsPromise.done(function (result) {
            QUnit.ok(false);
            QUnit.start();
            });
            existsPromise.fail(function (result) {
            QUnit.equal(result, false);
            QUnit.start();
            });
            });
            QUnit.asyncTest("test file read if fileSystem is null", function () {
            //arrange
            var filePath = "test.txt";
            File.fileSystem = null;
            //act
            var readPromise = File.Read(filePath);
            //assert
            readPromise.done(function (result) {
            QUnit.ok(false);
            QUnit.start();
            });
            readPromise.fail(function (result) {
            QUnit.equal(result, false);
            QUnit.start();
            });
            });
            QUnit.asyncTest("test file write if fileSystem is null", function () {
            //arrange
            var filePath = "test.txt";
            var data = "test text";
            File.fileSystem = null;
            //act
            var writePromise = File.Write(filePath, data);
            //assert
            writePromise.done(function (result) {
            QUnit.ok(false);
            QUnit.start();
            });
            writePromise.fail(function (result) {
            QUnit.equal(result, false);
            QUnit.start();
            });
        });*/
});