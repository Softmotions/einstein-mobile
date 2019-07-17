
package com.softmotions.einstein.modules;

import android.view.WindowManager;
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
  public void start() {
    getCurrentActivity().runOnUiThread(new Runnable() {
      @Override
      public void run() {
        getCurrentActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      }
    });
  }

  @ReactMethod
  public void stop() {
    getCurrentActivity().runOnUiThread(new Runnable() {
      @Override
      public void run() {
        getCurrentActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      }
    });
  }
}