package com.passagereactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import id.passage.android.Passage
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class PassageReactNativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

  @ReactMethod
  fun registerWithPasskey(identifier: String, promise: Promise) {
    val activity = currentActivity ?: return
    val passage = Passage(activity)
    activity.runOnUiThread {
      CoroutineScope(Dispatchers.Main).launch {
        try {
          val authResult = passage.registerWithPasskey(identifier)
          promise.resolve(authResult)
        } catch (e: Exception) {
          promise.reject(e)
        }
      }
    }

  }

  companion object {
    const val NAME = "PassageReactNative"
  }
}
