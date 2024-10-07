import AnyCodable

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

internal func codableToJSONString<T: Codable>(_ value: T) -> String {
  let encoder = JSONEncoder()
  encoder.keyEncodingStrategy = .convertFromSnakeCaseToCamelCase
  do {
    let jsonData = try encoder.encode(value)
    return String(data: jsonData, encoding: .utf8) ?? ""
  } catch {
    print("Error encoding object: \(error)")
    return ""
  }
}

extension JSONEncoder.KeyEncodingStrategy {
  static var convertFromSnakeCaseToCamelCase: JSONEncoder.KeyEncodingStrategy {
    return .custom { codingPath in
      var key = codingPath.last!.stringValue
      if let firstIndex = key.firstIndex(of: "_") {
        // Convert to camelCase by capitalizing the first character after each underscore
        var newKey = ""
        var makeUppercase = false
        for character in key {
          if character == "_" {
            makeUppercase = true
          } else if makeUppercase {
            newKey.append(character.uppercased())
            makeUppercase = false
          } else {
            newKey.append(character)
          }
        }
        key = newKey
      }
      return AnyKey(stringValue: key)!
    }
  }
}

// A custom key class to use in the key encoding strategy
struct AnyKey: CodingKey {
  var stringValue: String
  var intValue: Int?
  
  init?(intValue: Int) {
    self.intValue = intValue
    self.stringValue = "\(intValue)"
  }
  
  init?(stringValue: String) {
    self.stringValue = stringValue
    self.intValue = nil
  }
}
