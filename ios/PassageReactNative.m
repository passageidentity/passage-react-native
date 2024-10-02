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
RCT_EXTERN_METHOD(getCurrentUser:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(logOut:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(addDevicePasskey:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(deletePasskey:(NSString *)passkeyId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(editPasskey:(NSString *)passkeyId
                  withNewFriendlyName:(NSString *)newFriendlyName
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(changeEmail:(NSString *)newEmail
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(changePhone:(NSString *)newPhone
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

+ (BOOL)requiresMainQueueSetup
 {
   return NO;
 }

@end
