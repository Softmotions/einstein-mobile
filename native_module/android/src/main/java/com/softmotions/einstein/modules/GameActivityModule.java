
package com.softmotions.einstein.modules;

import android.app.Activity;
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
    Activity activity = getCurrentActivity();
    if (activity == null) {
      return;
    }
    activity.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        Activity activity = getCurrentActivity();
        if (activity == null) {
          return;
        }
        activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      }
    });
  }

  @ReactMethod
  public void stop() {
    Activity activity = getCurrentActivity();
    // в методе getCurrentActivity есть возможность получения null, если Activity еще не была RN-ом подключина(была отключена) к модулю
    // так как RN и android потоки не синхронизированы.
    // для устранения Exception добавлена проверка на null перед использованием activity
    if (activity == null) {
      return;
    }
    activity.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        Activity activity = getCurrentActivity();
        // повторно проверяем наличие Activity перед снятием флагов
        if (activity == null) {
          return;
        }
        activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      }
    });
  }
}