import Passage

internal func dictToJsonString(_ dict: [String: Any]) -> String {
    let jsonData = try! JSONSerialization.data(withJSONObject: dict, options: [])
    let jsonString = String(data: jsonData, encoding: .utf8)!
    return jsonString
}

internal extension AuthResult {
    
     func toDictionary() -> [String: Any] {
         var authResultDict: [String : Any] = [
             "authToken": authToken,
             "redirectUrl": redirectURL,
             "refreshToken": refreshToken,
             "refreshTokenExpiration": refreshTokenExpiration
         ]
         return authResultDict
     }
    
    func toJsonString() -> String {
        return dictToJsonString(toDictionary())
    }
    
 }

internal extension DeviceInfo {
    
    func toDictionary() -> [String: Any] {
        var authResultDict: [String : Any] = [
            "createdAt": createdAt,
            "credId": credId,
            "friendlyName": friendlyName,
            "id": id,
            "lastLoginAt": lastLoginAt,
            "updatedAt": updatedAt,
            "usageCount": usageCount,
            "userId": userId
        ]
        return authResultDict
    }
   
    func toJsonString() -> String {
        return dictToJsonString(toDictionary())
    }
    
}

internal extension PassageUserInfo {
    
     func toDictionary() -> [String: Any] {
         var userDict: [String : Any] = [
            "createdAt": createdAt,
            "email": email,
            "emailVerified": emailVerified,
            "id": id,
            "lastLoginAt": lastLoginAt,
            "loginCount": loginCount,
            "phone": phone,
            "phoneVerified": phoneVerified,
            "status": status,
            "updatedAt": updatedAt,
            "webauthn": webauthn,
            "webauthnDevices": webauthnDevices?.map { $0.toDictionary() },
            "webauthnTypes": webauthnTypes
         ]
         return userDict
     }
    
    func toJsonString() -> String {
        return dictToJsonString(toDictionary())
    }
    
 }

internal extension AppInfo {
    
    func toDictionary() -> [String: Any] {
        var appInfoDict: [String : Any] = [
            "allowedIdentifier": allowedIdentifier,
            "authFallbackMethod": authFallbackMethod?.rawValue,
            "authOrigin": authOrigin,
            "ephemeral": ephemeral,
            "id": id,
            "loginURL": loginURL,
            "name": name,
            "publicSignup": publicSignup,
            "redirectURL": redirectURL,
            "requiredIdentifier": requiredIdentifier,
            "requireEmailVerification": requireEmailVerification,
            "requireIdentifierVerification": requireIdentifierVerification,
            "sessionTimeoutLength": sessionTimeoutLength
        ]
        return appInfoDict
    }
    
    func toJsonString() -> String {
        return dictToJsonString(toDictionary())
    }
    
}
