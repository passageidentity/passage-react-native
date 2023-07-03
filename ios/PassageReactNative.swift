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
    
    @objc(devivceSupportsPasskeys:withRejecter:)
    func devivceSupportsPasskeys(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        if #available(iOS 16.0, *) {
            resolve(true)
        } else {
            resolve(false)
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
    
    // MARK: - Token Methods
    
    @objc(getAuthToken:withRejecter:)
    func getAuthToken(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let token = passage.tokenStore.authToken
        resolve(token)
    }
    
    @objc(isAuthTokenValid:withResolver:withRejecter:)
    func isAuthTokenValid(
        authToken: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let isValid = PassageTokenUtils.isTokenExpired(token: authToken)
        resolve(isValid)
    }
    
    @objc(refreshAuthToken:withRejecter:)
    func refreshAuthToken(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let authResult = try await passage.refresh()
                resolve(authResult.authToken)
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    // MARK: - User Methods
    
    @objc(getCurrentUser:withRejecter:)
    func getCurrentUser(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            let user = try? passage.getCurrentUser()
            resolve(user)
        }
    }
    
    @objc(signOut:withRejecter:)
    func signOut(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                await passage.signOut()
                resolve(nil)
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    @objc(addDevicePasskey:withRejecter:)
    func addDevicePasskey(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                try await passage.addDevice()
                // TODO: PassageAuth method should return Device Info, but does not.
                resolve("")
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    @objc(deleteDevicePasskey:withResolver:withRejecter:)
    func deleteDevicePasskey(
        deviceId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                try await passage.revokeDevice(deviceId: deviceId)
                resolve(nil)
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    @objc(editDevicePasskeyName:withNewDevicePasskeyName:withResolver:withRejecter:)
    func editDevicePasskeyName(
        deviceId: String,
        newDevicePasskeyName: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                guard let deviceInfo = try await passage
                    .editDevice(deviceId: deviceId, friendlyName: newDevicePasskeyName)
                else {
                    reject("0", "Error editing passkey name.", nil)
                    return
                }
                resolve(deviceInfo.toJsonString())
            } catch {
                reject("0", "\(error)", nil)
            }
        }
    }
    
    @objc(changeEmail:withResolver:withRejecter:)
    func changeEmail(
        newEmail: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        // TODO: PassageAuth method is private, need to make public
        reject("0", "Method not available", nil)
    }
    
    @objc(changePhone:withResolver:withRejecter:)
    func changePhone(
        newPhone: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        // TODO: PassageAuth method is private, need to make public
        reject("0", "Method not available", nil)
    }
    
}
