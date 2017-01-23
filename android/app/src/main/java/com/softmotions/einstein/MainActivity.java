package com.softmotions.einstein;

import android.os.Bundle;
import android.view.WindowManager;
import com.cboy.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;

/**
 * @author Vyacheslav Tyutyunkov (tve@softmotions.com)
 */
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Einstein";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
            }
        });
        SplashScreen.show(this);
    }
}
