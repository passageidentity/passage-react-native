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
