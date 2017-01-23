package com.softmotions.utils.play;

import android.os.Bundle;
import android.util.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.games.Games;

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

    @ReactMethod
    public void signIn(final Promise result) {
        GoogleApiClient googleApiClient = new GoogleApiClient.Builder(getReactApplicationContext())
            .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
                @Override
                public void onConnected(Bundle bundle) {
                    Log.w("gms", "connected");
                    result.resolve("yep");
                }

                @Override
                public void onConnectionSuspended(int i) {
                    Log.w("gms", "suspended");
                }
            })
            .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener() {
                @Override
                public void onConnectionFailed(ConnectionResult connectionResult) {
                    if (connectionResult.getErrorCode() == ConnectionResult.SIGN_IN_REQUIRED) {
                        // TODO: show sign in
                        Log.w("gms", "sign in required");
                    } else {
                        Log.w("gms", "failed");
                    }
                    result.reject(String.valueOf(connectionResult.getErrorCode()), "message");
                }
            })
            .addApi(Games.API).addScope(Games.SCOPE_GAMES)
            .build();


        googleApiClient.connect();
    }
}
