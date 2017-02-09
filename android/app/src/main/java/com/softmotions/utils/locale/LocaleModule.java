package com.softmotions.utils.locale;

import android.content.res.Resources;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.softmotions.einstein.R;

/**
 * @author Vyacheslav Tyutyunkov (tve@softmotions.com)
 */
public class LocaleModule extends ReactContextBaseJavaModule {

    public LocaleModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Locale";
    }

    @ReactMethod
    public String getString(String name) {
        Resources resources = getReactApplicationContext().getResources();
        int id = resources.getIdentifier(name, "string", R.string.app_package);
        return id == 0 ? null : resources.getString(id);
    }
}
