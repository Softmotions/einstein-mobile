
package com.softmotions.einstein.modules;

import android.app.Activity;
import android.view.WindowManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * @author Vyacheslav Tyutyunkov (tve@softmotions.com)
 */
public class GameActivityModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;

  public GameActivityModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "GameActivity";
  }

  @ReactMethod
  public void start(Promise promise) {
    final Activity activity = getCurrentActivity();
    if (activity == null) {
      promise.reject("Current activity is null");
      return;
    }
    activity.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      }
    });
    promise.resolve(null);
  }

  @ReactMethod
  public void stop(Promise promise) {
    final Activity activity = getCurrentActivity();
    if (activity == null) {
      promise.reject("Current activity is null");
      return;
    }
    activity.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      }
    });
    promise.resolve(null);
  }
}