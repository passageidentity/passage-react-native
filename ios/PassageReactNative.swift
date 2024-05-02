import Passage

@objc(PassageReactNative)
class PassageReactNative: NSObject {
    
    private lazy var passage: PassageAuth = {
        guard let appId else {
            return PassageAuth()
        }
        return PassageAuth(appId: appId)
    }()
    
    private var appId: String?
    
    @objc(initWithAppId:withResolver:withRejecter:)
    func initWithAppId(
        appId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        self.appId = appId
        resolve(())
    }
    
    // MARK: - Passkey Methods
    
    @objc(registerWithPasskey:withOptionsDictionary:withResolver:withRejecter:)
    func registerWithPasskey(
        identifier: String,
        optionsDictionary: NSDictionary?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        guard #available(iOS 16.0, *) else {
            reject("PASSKEYS_NOT_SUPPORTED", "Passkeys only supported in iOS 16+", nil)
            return
        }
        Task {
            do {
                var passkeyCreationOptions: PasskeyCreationOptions?
                if let authenticatorAttachmentString = optionsDictionary?["authenticatorAttachment"] as? String,
                   let authenticatorAttachment = AuthenticatorAttachment(rawValue: authenticatorAttachmentString)
                {
                    passkeyCreationOptions = PasskeyCreationOptions(authenticatorAttachment: authenticatorAttachment)
                }
                let authResult = try await passage.registerWithPasskey(identifier: identifier, options: passkeyCreationOptions)
                resolve(authResult.toJsonString())
            } catch PassageASAuthorizationError.canceled {
                reject("USER_CANCELLED", "User cancelled interaction", nil)
            } catch {
                reject("PASSKEY_ERROR", "\(error)", nil)
            }
        }
    }
    
    @objc(loginWithPasskey:withResolver:withRejecter:)
    func loginWithPasskey(
        identifier: String?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        guard #available(iOS 16.0, *) else {
            reject("PASSKEYS_NOT_SUPPORTED", "Passkeys only supported in iOS 16+", nil)
            return
        }
        Task {
            do {
                let authResult = try await passage.loginWithPasskey(identifier: identifier)
                resolve(authResult.toJsonString())
            } catch PassageASAuthorizationError.canceled {
                reject("USER_CANCELLED", "User cancelled interaction", nil)
            } catch {
                reject("PASSKEY_ERROR", "\(error)", nil)
            }
        }
    }
    
    @objc(deviceSupportsPasskeys:withRejecter:)
    func deviceSupportsPasskeys(
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
                reject("OTP_ERROR", "\(error)", nil)
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
                reject("OTP_ERROR", "\(error)", nil)
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
                var errorCode = "OTP_ERROR"
                if case PassageOTPError.exceededAttempts = error {
                    errorCode = "OTP_ACTIVATION_EXCEEDED_ATTEMPTS"
                }
                reject(errorCode, "\(error)", nil)
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
                reject("MAGIC_LINK_ERROR", "\(error)", nil)
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
                reject("MAGIC_LINK_ERROR", "\(error)", nil)
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
                reject("MAGIC_LINK_ERROR", "\(error)", nil)
            }
        }
    }
    
    @objc(getMagicLinkStatus:withResolver:withRejecter:)
    func getMagicLinkStatus(
        magicLinkId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let authResult = try await passage.getMagicLinkStatus(id: magicLinkId)
                resolve(authResult.toJsonString())
            } catch {
                reject("MAGIC_LINK_ERROR", "\(error)", nil)
            }
        }
    }
    
    // MARK: - Social Methods
    
    @objc(authorizeWith:withResolver:withRejecter:)
    func authorizeWith(
        connection: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                guard let safeConnection = PassageSocialConnection(rawValue: connection) else {
                    reject("SOCIAL_AUTH_ERROR", "Invalid connection.", nil)
                    return
                }
                guard let window = await UIApplication.shared.delegate?.window ?? nil else {
                    reject("SOCIAL_AUTH_ERROR", "Could not access app window.", nil)
                    return
                }
                let authResult = try await passage.authorize(with: safeConnection, in: window)
                resolve(authResult.toJsonString())
            } catch {
                reject("SOCIAL_AUTH_ERROR", "\(error)", nil)
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
        let isValid = !PassageTokenUtils.isTokenExpired(token: authToken)
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
                reject("TOKEN_ERROR", "\(error)", nil)
            }
        }
    }
    
    // MARK: - App Methods
    
    @objc(getAppInfo:withRejecter:)
    func getAppInfo(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                guard let appInfo = try await PassageAuth.appInfo() else {
                    reject("APP_INFO_ERROR", "Error getting app info.", nil)
                    return
                }
                resolve(appInfo.toJsonString())
            } catch {
                reject("APP_INFO_ERROR", "\(error)", nil)
            }
        }
    }
    
    @objc(identifierExists:withResolver:withRejecter:)
    internal func identifierExists(
        identifier: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            let user = try? await PassageAuth.getUser(identifier: identifier)
            resolve(user?.toJsonString())
        }
    }
    
    // MARK: - User Methods
    
    @objc(getCurrentUser:withRejecter:)
    func getCurrentUser(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let user = try await passage.getCurrentUser()
                resolve(user?.toJsonString())
            } catch {
                resolve(nil)
            }
        }
    }
    
    @objc(signOut:withRejecter:)
    func signOut(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            try? await passage.signOut()
            resolve(nil)
        }
    }
    
    @objc(addDevicePasskey:withRejecter:)
    func addDevicePasskey(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard #available(iOS 16.0, *) else {
            reject("PASSKEYS_NOT_SUPPORTED", "Passkeys only supported in iOS 16+", nil)
            return
        }
        Task {
            do {
                let device = try await passage.addDevice()
                resolve(device.toJsonString())
            } catch {
                reject("PASSKEY_ERROR", "\(error)", nil)
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
                reject("PASSKEY_ERROR", "\(error)", nil)
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
                    reject("PASSKEY_ERROR", "Error editing passkey name.", nil)
                    return
                }
                resolve(deviceInfo.toJsonString())
            } catch {
                reject("PASSKEY_ERROR", "\(error)", nil)
            }
        }
    }
    
    @objc(changeEmail:withResolver:withRejecter:)
    func changeEmail(
        newEmail: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let magicLink = try await passage.changeEmail(newEmail: newEmail)
                resolve(magicLink?.id)
            } catch PassageAPIError.unauthorized(let unauthorizedError) {
                reject("USER_UNAUTHORIZED", "\(unauthorizedError)", nil)
            } catch {
                reject("CHANGE_EMAIL_ERROR", "\(error)", nil)
            }
        }
    }
    
    @objc(changePhone:withResolver:withRejecter:)
    func changePhone(
        newPhone: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let magicLink = try await passage.changePhone(newPhone: newPhone)
                resolve(magicLink?.id)
            } catch PassageAPIError.unauthorized(let unauthorizedError) {
                reject("USER_UNAUTHORIZED", "\(unauthorizedError)", nil)
            } catch {
                reject("CHANGE_PHONE_ERROR", "\(error)", nil)
            }
        }
    }
    
}
