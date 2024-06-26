
package com.softmotions.einstein.modules;

import android.content.res.Resources;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.common.MapBuilder;
import com.softmotions.einstein.modules.R;

import java.lang.reflect.Field;
import java.util.Locale;
import java.util.Map;

/**
 * @author Vyacheslav Tyutyunkov (tve@softmotions.com)
 */
public class LocaleModule extends ReactContextBaseJavaModule {
  private static final String TAG = "LocaleModule";

  private final ReactApplicationContext reactContext;

  public LocaleModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
      return "Locale";
  }

  @Override
  public Map<String, Object> getConstants() {
    Map<String, Object> constants = MapBuilder.newHashMap();
    Resources resources = getReactApplicationContext().getResources();
    // R.string strings = new R.string();
    for (Field field : R.string.class.getDeclaredFields()) {
        try {
            int rId = field.getInt(R.string.class);
            if (rId != 0) {
                constants.put(field.getName(), resources.getString(rId));
            }
        } catch (IllegalAccessException ignored) {
        }
    }

    Locale locale = getReactApplicationContext().getResources().getConfiguration().locale;
    constants.put("locale", locale.getLanguage() + "_" + locale.getCountry());

    return constants;
  }
}