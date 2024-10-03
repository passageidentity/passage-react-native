#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PassageReactNative, NSObject)

RCT_EXTERN_METHOD(initWithAppId:(NSString *)appId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - App Methods
RCT_EXTERN_METHOD(appInfo:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(appUserExists:(NSString *)identifier
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(appCreateUser:(NSString *)identifier
                  withUserMetadata:( nullable NSDictionary *)userMetaData
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - Passkey Methods
RCT_EXTERN_METHOD(passkeyRegister:(NSString *)identifier
                  withOptionsDictionary:( nullable NSDictionary *)optionsDictionary
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(passkeyLogin:(nullable NSString *)identifier
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - OTP Methods
RCT_EXTERN_METHOD(oneTimePasscodeRegister:(NSString *)identifier
                  withLanguage:(nullable NSString *)language
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(oneTimePasscodeLogin:(NSString *)identifier
                  withLanguage:(nullable NSString *)language
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(oneTimePasscodeActivate:(NSString *)otp
                  withOtpId:(NSString *)otpId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - Magic Link Methods
RCT_EXTERN_METHOD(magicLinkRegister:(NSString *)identifier
                  withLanguage:(nullable NSString *)language
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(magicLinkLogin:(NSString *)identifier
                  withLanguage:(nullable NSString *)language
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(magicLinkActivate:(NSString *)userMagicLink
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(magicLinkStatus:(NSString *)magicLinkId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - Social Auth Methods
RCT_EXTERN_METHOD(socialAuthorize:(NSString *)connection
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - HOSTED Auth Methods
RCT_EXTERN_METHOD(hostedAuthorize:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - Token Methods
RCT_EXTERN_METHOD(tokenStoreGetValidAuthToken:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(tokenStoreIsAuthTokenValid:(NSString *)authToken
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(tokenStoreRefreshAuthToken:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(tokenStoreRevokeRefreshToken:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);


// MARK: - User Methods
RCT_EXTERN_METHOD(currentUserUserInfo:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentUserChangeEmail:(NSString *)newEmail
                  withLanguage:(nullable NSString *)language
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentUserChangePhone:(NSString *)newPhone
                  withLanguage:(nullable NSString *)language
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentUserPasskeys:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentUserEditPasskey:(NSString *)passkeyId
                  withNewFriendlyName:(NSString *)newFriendlyName
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentUserAddPasskey:(nullable NSDictionary *)options
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentUserDeletePasskey:(NSString *)passkeyId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentUserSocialConnections:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentUserDeleteSocialConnection:(NSString *)connection
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentUserMetadata:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentUserUpdateMetadata:(NSDictionary *)metadata
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentUserLogOut:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);


+ (BOOL)requiresMainQueueSetup
 {
   return NO;
 }

@end
