import Passage

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
        let jsonData = try! JSONSerialization.data(withJSONObject: toDictionary(), options: [])
        let jsonString = String(data: jsonData, encoding: .utf8)!
        return jsonString
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
       let jsonData = try! JSONSerialization.data(withJSONObject: toDictionary(), options: [])
       let jsonString = String(data: jsonData, encoding: .utf8)!
       return jsonString
   }
    
}
