package com.passagereactnative

import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import com.google.gson.Gson
import id.passage.android.Passage
import id.passage.android.PassageToken
import id.passage.android.exceptions.AddDevicePasskeyCancellationException
import id.passage.android.exceptions.AppInfoException
import id.passage.android.exceptions.GetMagicLinkStatusInvalidException
import id.passage.android.exceptions.GetMagicLinkStatusNotFoundException
import id.passage.android.exceptions.LoginWithPasskeyCancellationException
import id.passage.android.exceptions.PassageUserUnauthorizedException
import id.passage.android.exceptions.RegisterWithPasskeyCancellationException

@Suppress("unused")
class PassageReactNativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "PassageReactNative"
  }

  private val passage: Passage by lazy {
    Passage(currentActivity!!)
  }

  override fun getName(): String {
    return NAME
  }

  // region PASSKEY METHODS

  @ReactMethod
  fun registerWithPasskey(identifier: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val authResult = passage.registerWithPasskey(identifier)
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
  fun loginWithPasskey(promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val authResult = passage.loginWithPasskey("")
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

  @ReactMethod
  fun deviceSupportsPasskey(promise: Promise) {
    val supportsPasskeys = Build.VERSION.SDK_INT > 27
    promise.resolve(supportsPasskeys)
  }

  // endregion

  // region OTP METHODS

  @ReactMethod
  fun newRegisterOneTimePasscode(identifier: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val otpId = passage.newRegisterOneTimePasscode(identifier).otpId
        promise.resolve(otpId)
      } catch (e: Exception) {
        promise.reject("OTP_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun newLoginOneTimePasscode(identifier: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val otpId = passage.newLoginOneTimePasscode(identifier).otpId
        promise.resolve(otpId)
      } catch (e: Exception) {
        promise.reject("OTP_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun oneTimePasscodeActivate(otp: String, otpId: String, promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val authResult = passage.oneTimePasscodeActivate(otp, otpId)
        val jsonString = Gson().toJson(authResult)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("OTP_ERROR", e.message, e)
      }
    }
  }

  // endregion

  // region MAGIC LINK METHODS

  @ReactMethod
  fun newRegisterMagicLink(identifier: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val magicLinkId = passage.newRegisterMagicLink(identifier).id
        promise.resolve(magicLinkId)
      } catch (e: Exception) {
        promise.reject("MAGIC_LINK_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun newLoginMagicLink(identifier: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val magicLinkId = passage.newLoginMagicLink(identifier).id
        promise.resolve(magicLinkId)
      } catch (e: Exception) {
        promise.reject("MAGIC_LINK_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun magicLinkActivate(magicLink: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val authResult = passage.magicLinkActivate(magicLink)
        val jsonString = Gson().toJson(authResult)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("MAGIC_LINK_ERROR", e.message, e)
      }
    }
  }

  @ReactMethod
  fun getMagicLinkStatus(magicLinkId: String, promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val authResult = passage.getMagicLinkStatus(magicLinkId)
        val jsonString = Gson().toJson(authResult)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        var errorCode = "MAGIC_LINK_ERROR"
        when (e) {
          is GetMagicLinkStatusInvalidException -> {
            errorCode = "MAGIC_LINK_INVALID"
          }
        }
        promise.reject(errorCode, e.message, e)
      }
    }
  }

  // endregion

  // region TOKEN METHODS
  @ReactMethod
  fun getAuthToken(promise: Promise) {
    val token = passage.tokenStore.authToken
    promise.resolve(token)
  }

  @ReactMethod
  fun isAuthTokenValid(authToken: String, promise: Promise) {
    val isValid = PassageToken.isAuthTokenValid(authToken)
    promise.resolve(isValid)
  }

  @ReactMethod
  fun refreshAuthToken(promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val newToken = passage.tokenStore.getValidAuthToken()
        promise.resolve(newToken)
      } catch (e: Exception) {
        promise.reject("TOKEN_ERROR", e.message, e)
      }
    }
  }

  // region APP METHODS

  fun getAppInfo(promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val appInfo = passage.appInfo() ?: throw AppInfoException("Exception getting app info")
        val jsonString = Gson().toJson(appInfo)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject("APP_INFO_ERROR", e.message, e)
      }
    }
  }

  // endregion

  // region USER METHODS

  @ReactMethod
  fun getCurrentUser(promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val user = passage.getCurrentUser()
        promise.resolve(user)
      } catch (e: Exception) {
        promise.resolve(null)
      }
    }
  }

  @ReactMethod
  fun signOut(promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        passage.signOutCurrentUser()
        promise.resolve(null)
      } catch (e: Exception) {
        promise.resolve(null)
      }
    }
  }

  @ReactMethod
  fun addDevicePasskey(promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val user = passage.getCurrentUser() ?: throw PassageUserUnauthorizedException("User is not authorized.")
        val credential = user.addDevicePasskey(currentActivity!!)
        val jsonString = Gson().toJson(credential)
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
  fun deleteDevicePasskey(deviceId: String, promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val user = passage.getCurrentUser() ?: throw PassageUserUnauthorizedException("User is not authorized.")
        user.deleteDevicePasskey(deviceId)
        promise.resolve(null)
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
  fun editDevicePasskeyName(deviceId: String, newDevicePasskeyName: String, promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val user = passage.getCurrentUser() ?: throw PassageUserUnauthorizedException("User is not authorized.")
        val credential = user.editDevicePasskeyName(deviceId, newDevicePasskeyName)
        promise.resolve(credential)
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
  fun changeEmail(newEmail: String, promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val user = passage.getCurrentUser() ?: throw PassageUserUnauthorizedException("User is not authorized.")
        val magicLinkId = user.changeEmail(newEmail)?.id
        promise.resolve(magicLinkId)
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
  fun changePhone(newPhone: String, promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val user = passage.getCurrentUser() ?: throw PassageUserUnauthorizedException("User is not authorized.")
        val magicLinkId = user.changePhone(newPhone)?.id
        promise.resolve(magicLinkId)
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

  // endregion

}
