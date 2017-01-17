package com.softmotions.einstein;

import android.os.Bundle;
import android.view.WindowManager;
import com.cboy.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity
        /*implements OnConnectionFailedListener, ConnectionCallbacks*/ {

//    private GoogleApiClient mGoogleApiClient;

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


//        mGoogleApiClient = new GoogleApiClient.Builder(this)
//                .enableAutoManage(this, this)
//                .addConnectionCallbacks(this)
//                .addOnConnectionFailedListener(this)
//                .addApi(Games.API).addScope(Games.SCOPE_GAMES)
//                .build();
    }

//    @Override
//    public void onConnectionFailed(ConnectionResult connectionResult) {
//        Log.e("\n\n", "failed");
//    }
//
//    @Override
//    public void onConnected(Bundle bundle) {
//        Log.e("\n\n", "connected");
//    }
//
//    @Override
//    public void onConnectionSuspended(int i) {
//        Log.e("\n\n", "suspended");
//    }
}
