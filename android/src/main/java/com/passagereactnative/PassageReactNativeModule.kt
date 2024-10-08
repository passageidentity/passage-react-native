package com.passagereactnative

import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import com.google.gson.Gson
import id.passage.android.Passage
import id.passage.android.exceptions.AddDevicePasskeyCancellationException
import id.passage.android.exceptions.LoginWithPasskeyCancellationException
import id.passage.android.exceptions.OneTimePasscodeActivateExceededAttemptsException
import id.passage.android.exceptions.PassageUserUnauthorizedException
import id.passage.android.exceptions.RegisterWithPasskeyCancellationException
import id.passage.android.model.AuthenticatorAttachment
import id.passage.android.utils.Metadata
import id.passage.android.utils.PasskeyCreationOptions
import id.passage.android.utils.SocialConnection

@Suppress("unused")
class PassageReactNativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "PassageReactNative"
  }

  private var appId = ""

  private val passage: Passage by lazy {
    Passage(currentActivity!!, appId)
  }

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun initWithAppId(appId: String, promise: Promise) {
    this.appId = appId
    promise.resolve(null)
  }

  // region APP METHODS
  @ReactMethod
  fun appInfo(promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val appInfo = passage.app.info()
        val jsonString = Gson().toJson(appInfo)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("APP_INFO_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun appUserExists(identifier: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val user = passage.app.userExists(identifier)
        val jsonString = if (user == null) null else Gson().toJson(user)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("IDENTIFIER_EXISTS_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun appCreateUser(identifier: String, userMetadata: ReadableMap?, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val user = passage.app.createUser(identifier, userMetadata)
        val jsonString = Gson().toJson(user)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("IDENTIFIER_EXISTS_ERROR", e.message, e)
      }
    }
  }

  // endregion

  // region PASSKEY METHODS

  @ReactMethod
  fun passkeyRegister(identifier: String, optionsMap: ReadableMap?, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        var options: PasskeyCreationOptions? = null
        optionsMap?.getString("authenticatorAttachment")?.let {
          AuthenticatorAttachment.decode(it)?.let {
            options = PasskeyCreationOptions(it)
          }
        }
        val authResult = passage.passkey.register(identifier, options)
        val jsonString = Gson().toJson(authResult)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        var errorCode = "PASSKEY_ERROR"
        when (e) {
          is RegisterWithPasskeyCancellationException -> {
            errorCode = "USER_CANCELLED"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  @ReactMethod
  fun passkeyLogin(identifier: String?, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val authResult = passage.passkey.login(identifier)
        val jsonString = Gson().toJson(authResult)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        var errorCode = "PASSKEY_ERROR"
        when (e) {
          is LoginWithPasskeyCancellationException -> {
            errorCode = "USER_CANCELLED"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  // endregion

  // region OTP METHODS

  @ReactMethod
  fun oneTimePasscodeRegister(identifier: String, language: String?, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val otp = passage.oneTimePasscode.register(identifier, language)
        val jsonString = Gson().toJson(otp)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("OTP_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun oneTimePasscodeLogin(identifier: String, language: String?, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val otp = passage.oneTimePasscode.login(identifier, language)
        val jsonString = Gson().toJson(otp)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("OTP_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun oneTimePasscodeActivate(otp: String, otpId: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val authResult = passage.oneTimePasscode.activate(otp, otpId)
        val jsonString = Gson().toJson(authResult)
        promise.resolve(jsonString)
      } catch (e: OneTimePasscodeActivateExceededAttemptsException) {
        promise.reject("OTP_ACTIVATION_EXCEEDED_ATTEMPTS", e.message, e)
      } catch (e: Exception) {
        promise.reject("OTP_ERROR", e.message, e)
      }
    }
  }

  // endregion

  // region MAGIC LINK METHODS

  @ReactMethod
  fun magicLinkRegister(identifier: String, language: String?, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val magicLink = passage.magicLink.register(identifier, language)
        val jsonString = Gson().toJson(magicLink)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("MAGIC_LINK_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun magicLinkLogin(identifier: String, language: String?, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val magicLink = passage.magicLink.login(identifier, language)
        val jsonString = Gson().toJson(magicLink)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("MAGIC_LINK_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun magicLinkActivate(magicLink: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val authResult = passage.magicLink.activate(magicLink)
        val jsonString = Gson().toJson(authResult)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("MAGIC_LINK_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun magicLinkStatus(magicLinkId: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val authResult = passage.magicLink.status(magicLinkId)
        val jsonString = Gson().toJson(authResult)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        var errorCode = "MAGIC_LINK_ERROR"
        // TODO: Once we "invalid" error on iOS, we can uncomment this:
//        when (e) {
//          is GetMagicLinkStatusInvalidException -> {
//            errorCode = "MAGIC_LINK_INVALID"
//          }
//        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  // endregion

  // region SOCIAL METHODS
  @ReactMethod
  fun socialAuthorize(connection: String, promise: Promise) {
    val validConnection = SocialConnection.values()
      .firstOrNull { it.value == connection }
        ?: return promise.reject("SOCIAL_AUTH_ERROR", "Invalid connection type")
    passage.social.authorize(validConnection)
    promise.resolve(null)
  }

  @ReactMethod
  fun socialFinish(authCode: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val authResult = passage.social.finish(authCode)
        val jsonString = Gson().toJson(authResult)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("SOCIAL_AUTH_ERROR", e.message, e)
      }
    }
  }

  // endregion

  // Hosted Auth Region

  @ReactMethod
  fun hostedAuthorize(promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        passage.hosted.start()
        promise.resolve(null);
      } catch (e: Exception) {
        var errorCode = "START_HOSTED_AUTH_ERROR"
        promise.reject(errorCode, e.message, e);
      }
    }
  }

  @ReactMethod
  fun hostedFinish(code: String, state: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val authResultWithIdToken = passage.hosted.finish(code, state)
        val jsonString = Gson().toJson(authResultWithIdToken.first)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        val error = "FINISH_HOSTED_AUTH_ERROR"
        promise.reject(error, e.message, e);
      }
    }
  }

  // endregion

  // region TOKEN METHODS
  @ReactMethod
  fun tokenStoreGetValidAuthToken(promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val token = passage.tokenStore.getValidAuthToken()
        promise.resolve(token)
      } catch (e: Exception) {
        promise.resolve(null)
      }
    }
  }

  @ReactMethod
  fun tokenStoreIsAuthTokenValid(promise: Promise) {
    val token = passage.tokenStore.authToken ?: ""
    val isValid = passage.tokenStore.isAuthTokenValid(token)
    promise.resolve(isValid)
  }

  @ReactMethod
  fun tokenStoreRefreshAuthToken(promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val refreshToken = passage.tokenStore.refreshToken ?: ""
        val authResult = passage.tokenStore.refreshAuthToken(refreshToken)
        val jsonString = Gson().toJson(authResult)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("TOKEN_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun tokenStoreRevokeRefreshToken(promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val refreshToken = passage.tokenStore.refreshToken ?: ""
        passage.tokenStore.revokeRefreshToken(refreshToken)
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("TOKEN_ERROR", e.message, e)
      }
    }
  }

  // region USER METHODS

  @ReactMethod
  fun currentUserUserInfo(promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val user = passage.currentUser.userInfo()
        val jsonString = Gson().toJson(user)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.resolve(null)
      }
    }
  }

  @ReactMethod
  fun currentUserChangeEmail(newEmail: String, language: String?, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val magicLink = passage.currentUser.changeEmail(newEmail, language)
        val jsonString = Gson().toJson(magicLink)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        var errorCode = "CHANGE_EMAIL_ERROR"
        when (e) {
          is PassageUserUnauthorizedException -> {
            errorCode = "USER_UNAUTHORIZED"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  @ReactMethod
  fun currentUserChangePhone(newPhone: String, language: String?, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val magicLink = passage.currentUser.changePhone(newPhone, language)
        val jsonString = Gson().toJson(magicLink)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        var errorCode = "CHANGE_PHONE_ERROR"
        when (e) {
          is PassageUserUnauthorizedException -> {
            errorCode = "USER_UNAUTHORIZED"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  @ReactMethod
  fun currentUserPasskeys(promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val passkeys = passage.currentUser.passkeys()
        val jsonString = Gson().toJson(passkeys)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        var errorCode = "PASSKEY_ERROR"
        when (e) {
          is PassageUserUnauthorizedException -> {
            errorCode = "USER_UNAUTHORIZED"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  @ReactMethod
  fun currentUserEditPasskey(passkeyId: String, friendlyName: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val passkey = passage.currentUser.editPasskey(passkeyId, friendlyName)
        val jsonString = Gson().toJson(passkey)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        var errorCode = "PASSKEY_ERROR"
        when (e) {
          is PassageUserUnauthorizedException -> {
            errorCode = "USER_UNAUTHORIZED"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  @ReactMethod
  fun currentUserAddPasskey(optionsMap: ReadableMap?, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        var options: PasskeyCreationOptions? = null
        optionsMap?.getString("authenticatorAttachment")?.let {
          AuthenticatorAttachment.decode(it)?.let {
            options = PasskeyCreationOptions(it)
          }
        }
        val passkey = passage.currentUser.addPasskey(options)
        val jsonString = Gson().toJson(passkey)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        var errorCode = "PASSKEY_ERROR"
        when (e) {
          is AddDevicePasskeyCancellationException -> {
            errorCode = "USER_CANCELLED"
          }
          is PassageUserUnauthorizedException -> {
            errorCode = "USER_UNAUTHORIZED"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  @ReactMethod
  fun currentUserDeletePasskey(passkeyId: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        passage.currentUser.deletePasskey(passkeyId)
        promise.resolve(true)
      } catch (e: Exception) {
        var errorCode = "PASSKEY_ERROR"
        when (e) {
          is PassageUserUnauthorizedException -> {
            errorCode = "USER_UNAUTHORIZED"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  @ReactMethod
  fun currentUserSocialConnections(promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val socialConnections = passage.currentUser.socialConnections()
        val jsonString = Gson().toJson(socialConnections) // Returns JSON string
        promise.resolve(jsonString)
      } catch (e: Exception) {
        var errorCode = "SOCIAL_CONNECTIONS_ERROR"
        when (e) {
          is PassageUserUnauthorizedException -> {
            errorCode = "USER_UNAUTHORIZED"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  @ReactMethod
  fun currentUserDeleteSocialConnection(socialConnection: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val socialConnectionType =
          SocialConnection.values().firstOrNull { it.value == socialConnection }
            ?: throw IllegalArgumentException("Unknown social connection type")
        passage.currentUser.deleteSocialConnection(socialConnectionType)
        promise.resolve(true)
      } catch (e: Exception) {
        var errorCode = "SOCIAL_CONNECTIONS_ERROR"
        when (e) {
          is PassageUserUnauthorizedException -> {
            errorCode = "USER_UNAUTHORIZED"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  @ReactMethod
  fun currentUserMetadata(promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val metaData = passage.currentUser.metadata()
        val jsonString = Gson().toJson(metaData)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        var errorCode = "SOCIAL_CONNECTIONS_ERROR"
        when (e) {
          is PassageUserUnauthorizedException -> {
            errorCode = "USER_UNAUTHORIZED"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  @ReactMethod
  fun currentUserUpdateMetadata(metaDataMap: ReadableMap, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val metaData = Metadata(userMetadata = metaDataMap)
        val user = passage.currentUser.updateMetadata(metaData)
        val jsonString = Gson().toJson(user)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        var errorCode = "SOCIAL_CONNECTIONS_ERROR"
        when (e) {
          is PassageUserUnauthorizedException -> {
            errorCode = "USER_UNAUTHORIZED"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  @ReactMethod
  fun currentUserLogOut(promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        passage.currentUser.logout()
        promise.resolve(null)
      } catch (e: Exception) {
        promise.resolve(null)
      }
    }
  }

  // endregion

}
