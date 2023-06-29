import Passage

@objc(PassageReactNative)
class PassageReactNative: NSObject {

  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
  }
    
    @objc public func registerWithPasskey(
        _ identifier: String,
        resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
      ) -> Void {
          Task {
            do {
                let passage = PassageAuth()
                let result = try await passage.registerWithPasskey(identifier: identifier)
                let encodedData = try JSONEncoder().encode(result)
                let jsonString = String(data: encodedData, encoding: .utf8)
                resolve(jsonString)
            }
            catch {
              reject("0", "\(error)", nil)
            }
          }
      }
}
