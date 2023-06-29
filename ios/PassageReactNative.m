#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PassageReactNative, NSObject)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

// MARK: - Passkey Methods
RCT_EXTERN_METHOD(registerWithPasskey:(NSString *)identifier
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(loginWithPasskey:(RCTPromiseResolveBlock)resolve
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



@end
