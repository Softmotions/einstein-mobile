package com.softmotions.utils.play;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

/**
 * @author Vyacheslav Tyutyunkov (tve@softmotions.com)
 */
public class PlayGamesModule extends ReactContextBaseJavaModule {

    public PlayGamesModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PlayGames";
    }
}
