import AnyCodable
import Passage

@objc(PassageReactNative)
class PassageReactNative: NSObject {
  
  private lazy var passage: Passage = {
    return Passage(appId: appId ?? "")
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
  
  // MARK: - App Methods
  
  @objc(appInfo:withRejecter:)
  func appInfo(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let appInfo = try await passage.app.info()
        resolve(codableToJSONString(appInfo))
      } catch {
        reject("APP_INFO_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(appUserExists:withResolver:withRejecter:)
  func appUserExists(
    identifier: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let user = try await passage.app.userExists(identifier: identifier)
        resolve(codableToJSONString(user))
      } catch {
        reject("APP_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(appCreateUser:withUserMetadata:withResolver:withRejecter:)
  func appCreateUser(
    identifier: String,
    userMetaData: NSDictionary?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let metadata = convertNSDictionaryToAnyCodable(userMetaData)
        let user = try await passage.app.createUser(
          identifier: identifier,
          userMetadata: metadata
        )
        resolve(codableToJSONString(user))
      } catch {
        reject("CREATE_USER_ERROR", "\(error)", nil)
      }
    }
  }
  
  // MARK: - Passkey Methods
  
  @objc(passkeyRegister:withOptionsDictionary:withResolver:withRejecter:)
  func passkeyRegister(
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
          passkeyCreationOptions = PasskeyCreationOptions(
            authenticatorAttachment: authenticatorAttachment
          )
        }
        let authResult = try await passage.passkey.register(
          identifier: identifier,
          options: passkeyCreationOptions
        )
        resolve(codableToJSONString(authResult))
      } catch PassagePasskeyError.canceled {
        reject("USER_CANCELLED", "User cancelled interaction", nil)
      } catch {
        reject("PASSKEY_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(passkeyLogin:withResolver:withRejecter:)
  func passkeyLogin(
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
        let authResult = try await passage.passkey.login(identifier: identifier)
        resolve(codableToJSONString(authResult))
      } catch PassagePasskeyError.canceled {
        reject("USER_CANCELLED", "User cancelled interaction", nil)
      } catch {
        reject("PASSKEY_ERROR", "\(error)", nil)
      }
    }
  }
  
  // MARK: - OTP Methods
  
  @objc(oneTimePasscodeRegister:withLanguage:withResolver:withRejecter:)
  func oneTimePasscodeRegister(
    identifer: String,
    language: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let otp = try await passage.oneTimePasscode.register(
          identifier: identifer,
          language: language
        )
        resolve(codableToJSONString(otp))
      } catch {
        reject("OTP_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(oneTimePasscodeLogin:withLanguage:withResolver:withRejecter:)
  func oneTimePasscodeLogin(
    identifer: String,
    language: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let otp = try await passage.oneTimePasscode.login(
          identifier: identifer,
          language: language
        )
        resolve(codableToJSONString(otp))
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
        let authResult = try await passage.oneTimePasscode.activate(
          otp: otp,
          id: otpId
        )
        resolve(codableToJSONString(authResult))
      } catch {
        var errorCode = "OTP_ERROR"
        if case OneTimePasscodeError.exceededAttempts = error {
          errorCode = "OTP_ACTIVATION_EXCEEDED_ATTEMPTS"
        }
        reject(errorCode, "\(error)", nil)
      }
    }
  }
  
  // MARK: - Magic Link Methods
  
  @objc(magicLinkRegister:withLanguage:withResolver:withRejecter:)
  func magicLinkRegister(
    identifer: String,
    language: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let magicLink = try await passage.magicLink.register(
          identifier: identifer,
          language: language
        )
        resolve(codableToJSONString(magicLink))
      } catch {
        reject("MAGIC_LINK_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(magicLinkLogin:withLanguage:withResolver:withRejecter:)
  func magicLinkLogin(
    identifer: String,
    language: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let magicLink = try await passage.magicLink.login(
          identifier: identifer,
          language: language
        )
        resolve(codableToJSONString(magicLink))
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
        let authResult = try await passage.magicLink.activate(magicLink: userMagicLink)
        resolve(codableToJSONString(authResult))
      } catch {
        reject("MAGIC_LINK_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(magicLinkStatus:withResolver:withRejecter:)
  func magicLinkStatus(
    magicLinkId: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let authResult = try await passage.magicLink.status(id: magicLinkId)
        resolve(codableToJSONString(authResult))
      } catch {
        reject("MAGIC_LINK_ERROR", "\(error)", nil)
      }
    }
  }
  
  // MARK: - Social Methods
  
  @objc(socialAuthorize:withResolver:withRejecter:)
  func socialAuthorize(
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
        let authResult = try await passage.social.authorize(connection: safeConnection)
        resolve(codableToJSONString(authResult))
      } catch {
        reject("SOCIAL_AUTH_ERROR", "\(error)", nil)
      }
    }
  }
  
  // MARK: - Hosted Methods
  
  @objc(hostedAuthorize:withRejecter:)
  func hostedAuthorize(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      do {
        let authResult = try await passage.hosted.authorize()
        resolve(codableToJSONString(authResult))
      } catch {
        let errorCode = "HOSTED_AUTH_ERROR"
        reject(errorCode, "\(error)", nil)
      }
    }
  }
  
  // MARK: - Token Methods
  
  @objc(tokenStoreGetValidAuthToken:withRejecter:)
  func tokenStoreGetValidAuthToken(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      let token = try? await passage.tokenStore.getValidAuthToken()
      resolve(token)
    }
  }
  
  @objc(tokenStoreIsAuthTokenValid:withRejecter:)
  func tokenStoreIsAuthTokenValid(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    let isValid = passage.tokenStore.isAuthTokenValid()
    resolve(isValid)
  }
  
  @objc(tokenStoreRefreshAuthToken:withRejecter:)
  func tokenStoreRefreshAuthToken(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let authResult = try await passage.tokenStore.refreshTokens()
        resolve(codableToJSONString(authResult))
      } catch {
        reject("TOKEN_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(tokenStoreRevokeRefreshToken:withRejecter:)
  func tokenStoreRevokeRefreshToken(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        try await passage.tokenStore.revokeRefreshToken()
        resolve(())
      } catch {
        reject("TOKEN_ERROR", "\(error)", nil)
      }
    }
  }
  
  // MARK: - User Methods
  
  @objc(currentUserUserInfo:withRejecter:)
  func currentUserUserInfo(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let user = try await passage.currentUser.userInfo()
        resolve(codableToJSONString(user))
      } catch {
        reject("USER_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(currentUserChangeEmail:withLanguage:withResolver:withRejecter:)
  func currentUserChangeEmail(
    newEmail: String,
    language: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let magicLink = try await passage.currentUser.changeEmail(newEmail: newEmail, language: language)
        resolve(codableToJSONString(magicLink))
      } catch CurrentUserError.unauthorized(let unauthorizedError) {
        reject("USER_UNAUTHORIZED", "\(unauthorizedError)", nil)
      } catch {
        reject("CHANGE_EMAIL_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(currentUserChangePhone:withLanguage:withResolver:withRejecter:)
  func currentUserChangePhone(
    newPhone: String,
    language: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let magicLink = try await passage.currentUser.changePhone(
          newPhone: newPhone,
          language: language
        )
        resolve(codableToJSONString(magicLink))
      } catch CurrentUserError.unauthorized(let unauthorizedError) {
        reject("USER_UNAUTHORIZED", "\(unauthorizedError)", nil)
      } catch {
        reject("CHANGE_PHONE_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(currentUserPasskeys:withRejecter:)
  func currentUserPasskeys(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let passkeys = try await passage.currentUser.passkeys()
        resolve(codableToJSONString(passkeys))
      } catch {
        reject("PASSKEY_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(currentUserAddPasskey:withResolver:withRejecter:)
  func currentUserAddPasskey(
    options: NSDictionary?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.0, *) else {
      reject("PASSKEYS_NOT_SUPPORTED", "Passkeys only supported in iOS 16+", nil)
      return
    }
    Task {
      do {
        var passkeyCreationOptions: PasskeyCreationOptions?
        if let authenticatorAttachmentString = options?["authenticatorAttachment"] as? String,
           let authenticatorAttachment = AuthenticatorAttachment(rawValue: authenticatorAttachmentString)
        {
          passkeyCreationOptions = PasskeyCreationOptions(
            authenticatorAttachment: authenticatorAttachment
          )
        }
        let passkey = try await passage.currentUser.addPasskey(options: passkeyCreationOptions)
        resolve(codableToJSONString(passkey))
      } catch {
        reject("PASSKEY_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(currentUserDeletePasskey:withResolver:withRejecter:)
  func currentUserDeletePasskey(
    passkeyId: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        try await passage.currentUser.deletePasskey(passkeyId: passkeyId)
        resolve(true)
      } catch {
        reject("PASSKEY_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(currentUserEditPasskey:withNewFriendlyName:withResolver:withRejecter:)
  func currentUserEditPasskey(
    passkeyId: String,
    newFriendlyName: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let passkey = try await passage.currentUser.editPasskey(
          passkeyId: passkeyId,
          newFriendlyName: newFriendlyName
        )
        resolve(codableToJSONString(passkey))
      } catch {
        reject("PASSKEY_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(currentUserSocialConnections:withRejecter:)
  func currentUserSocialConnections(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let socialConnections = try await passage.currentUser.socialConnections()
        resolve(codableToJSONString(socialConnections))
      } catch {
        
      }
    }
  }
  
  @objc(currentUserDeleteSocialConnection:withResolver:withRejecter:)
  func currentUserDeleteSocialConnection(
    socialConnectionType: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let socialConnection = SocialConnection(rawValue: socialConnectionType) else {
      reject("USER_ERROR", "Invalid request", nil)
      return
    }
    Task {
      do {
        try await passage.currentUser.deleteSocialConnection(
          socialConnectionType: socialConnection
        )
        resolve(())
      } catch {
        reject("USER_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(currentUserMetadata:withRejecter:)
  func currentUserMetadata(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        let metadata = try await passage.currentUser.metadata()
        resolve(codableToJSONString(metadata))
      } catch {
        reject("USER_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(currentUserUpdateMetadata:withResolver:withRejecter:)
  func currentUserUpdateMetadata(
    metadata: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let dictionary = metadata as? [String: Any] else {
      reject("USER_ERROR", "Invalid request", nil)
      return
    }
    Task {
      do {
        let newMetaData = AnyCodable(dictionary)
        let userInfo = try await passage.currentUser.updateMetadata(newMetaData: newMetaData)
        resolve(codableToJSONString(userInfo))
      } catch {
        reject("USER_ERROR", "\(error)", nil)
      }
    }
  }
  
  @objc(currentUserLogOut:withRejecter:)
  func currentUserLogOut(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      try? await passage.currentUser.logOut()
      resolve(nil)
    }
  }
  
}
