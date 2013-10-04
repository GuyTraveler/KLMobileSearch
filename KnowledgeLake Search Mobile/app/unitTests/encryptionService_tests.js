define(["services/encryptionService", 
		"jquery"], function (EncryptionService, $) {
        QUnit.module("services/encryptionService");

        QUnit.test("test encrypt", function () {
            var password = "password";
            
            //act
            var result = EncryptionService.encrypt(password, window.device.uuid);
                        
            //assert
            QUnit.notEqual(result, password);
        });    
            
        QUnit.test("test decrypt", function () {
            var password = "password", 
                encryptedPassword = EncryptionService.encrypt(password, window.device.uuid).toString();
            
            //act
            var result = EncryptionService.decrypt(encryptedPassword, window.device.uuid);
                        
            //assert
            QUnit.notEqual(result, encryptedPassword);
            QUnit.equal(result, password);
        });
});