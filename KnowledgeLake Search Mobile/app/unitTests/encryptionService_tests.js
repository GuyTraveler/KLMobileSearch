define(["services/encryptionService",
        "application",
		"jquery"],
function (EncryptionService, application, $) {
        QUnit.module("services/encryptionService");

        QUnit.test("test encrypt", function () {
            var password = "password";
            
            //act
            var result = EncryptionService.encrypt(password, application.deviceUUID);
                        
            //assert
            QUnit.notEqual(result, password);
        });    
            
        QUnit.test("test decrypt", function () {
            var password = "password", 
                encryptedPassword = EncryptionService.encrypt(password, application.deviceUUID).toString();
            
            //act
            var result = EncryptionService.decrypt(encryptedPassword, application.deviceUUID);
                        
            //assert
            QUnit.notEqual(result, encryptedPassword);
            QUnit.equal(result, password);
        });
});