import AnyCodable
import Passage

internal func dictToJsonString(_ dict: [String: Any?]) -> String {
    let jsonData = try! JSONSerialization.data(withJSONObject: dict, options: [])
    let jsonString = String(data: jsonData, encoding: .utf8)!
    return jsonString
}

internal extension AuthResult {
    
     func toDictionary() -> [String: Any?] {
         var authResultDict: [String : Any?] = [
             "authToken": authToken,
             "refreshToken": refreshToken,
             "refreshTokenExpiration": refreshTokenExpiration
         ]
         return authResultDict
     }
    
    func toJsonString() -> String {
        return dictToJsonString(toDictionary())
    }
    
 }

internal extension Passkey {
    
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

internal extension CurrentUser {
    
     func toDictionary() -> [String: Any?] {
         var userDict: [String : Any?] = [
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
            "userMetadata": userMetadata,
            "webauthn": webauthn,
            "webauthnDevices": webauthnDevices.map { $0.toDictionary() },
            "webauthnTypes": webauthnTypes
         ]
         return userDict
     }
    
    func toJsonString() -> String {
        return dictToJsonString(toDictionary())
    }
    
 }

internal extension PublicUserInfo {
  
  func toDictionary() -> [String: Any?] {
    var userDict: [String : Any?] = [
      "email": email,
      "emailVerified": emailVerified,
      "id": id,
      "phone": phone,
      "phoneVerified": phoneVerified,
      "status": status,
      "userMetadata": userMetadata,
      "webauthn": webauthn,
      "webauthnTypes": webauthnTypes
    ]
    return userDict
  }
  
  func toJsonString() -> String {
    return dictToJsonString(toDictionary())
  }
  
}

internal extension PassageAppInfo {
    
    func toDictionary() -> [String: Any] {
        var appInfoDict: [String : Any] = [
            "allowedIdentifier": allowedIdentifier,
            "authOrigin": authOrigin,
            "id": id,
            "name": name,
            "publicSignup": publicSignup,
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


internal extension AuthMethods {
    func toDictionary() -> [String: Any] {
        var dict: [String : Any] = [
            "passkeys": passkeys == nil ? nil : [:] as [String: String],
            "otp": otp == nil ? nil : ["ttl": otp?.ttl, "ttlDisplayUnit": otp?.ttlDisplayUnit?.rawValue],
            "magicLink": magicLink == nil ? nil : ["ttl": magicLink?.ttl, "ttlDisplayUnit": magicLink?.ttlDisplayUnit?.rawValue],
        ]
        return dict
    }
   
    func toJsonString() -> String {
        return dictToJsonString(toDictionary())
    }
}

func convertNSDictionaryToAnyCodable(_ nsDictionary: NSDictionary?) -> AnyCodable? {
  guard let dictionary = nsDictionary as? [String: Any] else {
    return nil
  }
  
  let anyCodableDictionary = dictionary.mapValues { value -> AnyCodable in
    if let dict = value as? NSDictionary {
      return convertNSDictionaryToAnyCodable(dict) ?? AnyCodable(nil)
    } else if let array = value as? NSArray {
      return AnyCodable(array.map { convertNSDictionaryToAnyCodable($0 as? NSDictionary) ?? AnyCodable($0) })
    } else {
      return AnyCodable(value)
    }
  }
  
  return AnyCodable(anyCodableDictionary)
}

extension AnyCodable {
  func toJSONString(prettyPrinted: Bool = false) -> String? {
    let encoder = JSONEncoder()
    if prettyPrinted {
      encoder.outputFormatting = .prettyPrinted
    }
    
    do {
      let jsonData = try encoder.encode(self)
      return String(data: jsonData, encoding: .utf8)
    } catch {
      print("Failed to encode AnyCodable to JSON string: \(error)")
      return nil
    }
  }
}
