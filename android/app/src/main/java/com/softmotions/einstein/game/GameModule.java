package com.softmotions.einstein.game;

import android.view.WindowManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 */
public class GameModule extends ReactContextBaseJavaModule {
    public GameModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "EinsteinGame";
    }

    @ReactMethod
    public void startActivity() {
        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getCurrentActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
        });
    }

    @ReactMethod
    public void stopActivity() {
        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getCurrentActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
        });
    }
}
