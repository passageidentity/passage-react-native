#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PassageReactNative, NSObject)

RCT_EXTERN_METHOD(initWithAppId:(NSString *)appId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - Passkey Methods
RCT_EXTERN_METHOD(registerWithPasskey:(NSString *)identifier
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(loginWithPasskey:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);


RCT_EXTERN_METHOD(deviceSupportsPasskeys:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - OTP Methods
RCT_EXTERN_METHOD(newRegisterOneTimePasscode:(NSString *)identifier
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(newLoginOneTimePasscode:(NSString *)identifier
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(oneTimePasscodeActivate:(NSString *)otp
                  withOtpId:(NSString *)otpId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - Magic Link Methods
RCT_EXTERN_METHOD(newRegisterMagicLink:(NSString *)identifier
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(newLoginMagicLink:(NSString *)identifier
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(magicLinkActivate:(NSString *)userMagicLink
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(getMagicLinkStatus:(NSString *)magicLinkId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - Social Auth Methods
RCT_EXTERN_METHOD(authorizeWith:(NSString *)connection
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - Token Methods
RCT_EXTERN_METHOD(getAuthToken:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(isAuthTokenValid:(NSString *)authToken
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(refreshAuthToken:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

// MARK: - App Methods
RCT_EXTERN_METHOD(getAppInfo:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(identifierExists:(NSString *)identifier
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);


// MARK: - User Methods
RCT_EXTERN_METHOD(getCurrentUser:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(signOut:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(addDevicePasskey:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(deleteDevicePasskey:(NSString *)deviceId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(editDevicePasskeyName:(NSString *)deviceId
                  withNewDevicePasskeyName:(NSString *)newDevicePasskeyName
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
