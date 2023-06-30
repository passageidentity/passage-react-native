package com.passagereactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import com.google.gson.Gson
import id.passage.android.Passage

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
        promise.reject(e)
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
        promise.reject(e)
      }
    }
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
        promise.reject(e)
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
        promise.reject(e)
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
        promise.reject(e)
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
        promise.reject(e)
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
        promise.reject(e)
      }
    }
  }

  @ReactMethod
  fun magicLinkActivate(magicLink: String, promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val authResult = passage.magicLinkActivate(magicLink)
        val jsonString = Gson().toJson(authResult)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject(e)
      }
    }
  }

  // endregion

  // region USER METHODS

  @ReactMethod
  fun addDevicePasskey(promise: Promise) {
    CoroutineScope((Dispatchers.IO)).launch {
      try {
        val user = passage.getCurrentUser() ?: throw Exception("Could not get current user.")
        val credential = user.addDevicePasskey(currentActivity!!)
        val jsonString = Gson().toJson(credential)
        promise.resolve(jsonString)
      } catch (e: Exception) {
        promise.reject(e)
      }
    }
  }

  // endregion

}
