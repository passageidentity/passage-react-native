import Passage

@objc(PassageReactNative)
class PassageReactNative: NSObject {
    
    private let passage = PassageAuth()
    
    // MARK: - Passkey Methods
    
    @objc(registerWithPasskey:withResolver:withRejecter:)
    func registerWithPasskey(
        identifier: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        guard #available(iOS 16.0, *) else {
            reject("0", "Only available in iOS 16+", nil)
            return
        }
        Task {
            do {
                let authResult = try await passage.registerWithPasskey(identifier: identifier)
                resolve(authResult.toJsonString())
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    @objc(loginWithPasskey:withRejecter:)
    func loginWithPasskey(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        guard #available(iOS 16.0, *) else {
            reject("0", "Only available in iOS 16+", nil)
            return
        }
        Task {
            do {
                let authResult = try await passage.loginWithPasskey()
                resolve(authResult.toJsonString())
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    // MARK: - OTP Methods
    
    @objc(newRegisterOneTimePasscode:withResolver:withRejecter:)
    func newRegisterOneTimePasscode(
        identifer: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let otpId = try await PassageAuth.newRegisterOneTimePasscode(identifier: identifer).id
                resolve(otpId)
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    @objc(newLoginOneTimePasscode:withResolver:withRejecter:)
    func newLoginOneTimePasscode(
        identifer: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let otpId = try await PassageAuth.newLoginOneTimePasscode(identifier: identifer).id
                resolve(otpId)
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    @objc(oneTimePasscodeActivate:withOtpId:withResolver:withRejecter:)
    func oneTimePasscodeActivate(
        otp: String,
        otpId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let authResult = try await passage.oneTimePasscodeActivate(otp: otp, otpId: otpId)
                resolve(authResult.toJsonString())
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    // MARK: - Magic Link Methods
    
    @objc(newRegisterMagicLink:withResolver:withRejecter:)
    func newRegisterMagicLink(
        identifer: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let magicLinkId = try await PassageAuth.newRegisterMagicLink(identifier: identifer).id
                resolve(magicLinkId)
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    @objc(newLoginMagicLink:withResolver:withRejecter:)
    func newLoginMagicLink(
        identifer: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let magicLinkId = try await PassageAuth.newLoginMagicLink(identifier: identifer).id
                resolve(magicLinkId)
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    @objc(magicLinkActivate:withResolver:withRejecter:)
    func magicLinkActivate(
        userMagicLink: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let authResult = try await passage.magicLinkActivate(userMagicLink: userMagicLink)
                resolve(authResult.toJsonString())
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    // MARK: - User Methods
    
    @objc(addDevicePasskey:withRejecter:)
    func addDevicePasskey(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                try await passage.addDevice()
                resolve(nil)
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
}
