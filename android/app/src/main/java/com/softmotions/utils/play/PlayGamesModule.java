package com.softmotions.utils.play;

import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.util.Log;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.games.Games;
import com.google.android.gms.games.GamesActivityResultCodes;

/**
 * @author Vyacheslav Tyutyunkov (tve@softmotions.com)
 */
public class PlayGamesModule extends ReactContextBaseJavaModule
        implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener, LifecycleEventListener {

    private static final int GOOGLE_SIGN_IN_REQUEST = 8615;
    private static final int SHOW_ACHIEVEMENTS_REQUEST = 5001;
    private static final int SHOW_LEADERBOARD_REQUEST = 5002;

    private static final String TAG = "PlayGamesModule";

    private Promise mActivityPromise;

    private GoogleApiClient mGoogleApiClient;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            switch (requestCode) {
                case GOOGLE_SIGN_IN_REQUEST:
                    if (mActivityPromise != null) {
                        if (resultCode == Activity.RESULT_CANCELED) {
                            mActivityPromise.reject(TAG, "canceled");
                        } else if (resultCode == Activity.RESULT_OK) {
                            if (!getGoogleApiClient().isConnected() && !getGoogleApiClient().isConnecting()) {
                                getGoogleApiClient().connect();
                            }
                            return;
                        } else {
                            mActivityPromise.reject(TAG, "unexpected");
                        }
                    }
                    mActivityPromise = null;
                    break;
                case SHOW_ACHIEVEMENTS_REQUEST:
                case SHOW_LEADERBOARD_REQUEST:
                    if (resultCode == GamesActivityResultCodes.RESULT_RECONNECT_REQUIRED) {
                        Log.e(TAG, "onActivityResult: disconnect");
                        getGoogleApiClient().disconnect();
                        getReactApplicationContext()
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("googleSignOut", Arguments.createMap());
                    }
                    break;
            }
        }
    };

    public PlayGamesModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "PlayGames";
    }

    private GoogleApiClient getGoogleApiClient() {
        if (mGoogleApiClient == null) {
            mGoogleApiClient = new GoogleApiClient.Builder(getReactApplicationContext().getCurrentActivity())
                    .addConnectionCallbacks(this)
                    .addOnConnectionFailedListener(this)
                    .addApi(Games.API).addScope(Games.SCOPE_GAMES)
                    .build();
        }
        return mGoogleApiClient;
    }

    @Override
    public void onConnected(Bundle bundle) {
        Log.d(TAG, "onConnected: ");
        if (mActivityPromise != null) {
            mActivityPromise.resolve(null);
            mActivityPromise = null;
        }
    }

    @Override
    public void onConnectionSuspended(int i) {
        Log.d(TAG, "onConnectionSuspended: ");
        getGoogleApiClient().connect();
    }

    @Override
    public void onConnectionFailed(ConnectionResult result) {
        Log.d(TAG, "onConnectionFailed: ");
        if (result.hasResolution()) {
            try {
                result.startResolutionForResult(getCurrentActivity(), GOOGLE_SIGN_IN_REQUEST);
            } catch (IntentSender.SendIntentException e) {
                getGoogleApiClient().connect();
            }
        } else {
            Dialog dialog = GoogleApiAvailability.getInstance()
                    .getErrorDialog(getCurrentActivity(), result.getErrorCode(), GOOGLE_SIGN_IN_REQUEST);
            if (dialog != null) {
                dialog.show();
            }
            Log.w(TAG, "onConnectionFailed: failed resolve");
            mActivityPromise.reject(TAG, "failed");
        }
    }

    public boolean isSignedIn() {
        return getGoogleApiClient().isConnected();
    }

    @ReactMethod
    public void signIn(Promise promise) {
        Log.d(TAG, "signIn: ");
        if (getGoogleApiClient().isConnected()) {
            Log.d(TAG, "signIn: already connected");
            promise.resolve(null);
            return;
        }
        mActivityPromise = promise;
        getGoogleApiClient().connect();
    }

    @ReactMethod
    public void signOut(Promise promise) {
        if (getGoogleApiClient().isConnected()) {
            Games.signOut(getGoogleApiClient());
            getGoogleApiClient().disconnect();
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void achievementUnlock(String id) {
        if (isSignedIn()) {
            Games.Achievements.unlock(getGoogleApiClient(), id);
        }
    }

    @ReactMethod
    public void showAchievements() {
        if (isSignedIn()) {
            getCurrentActivity().startActivityForResult(Games.Achievements.getAchievementsIntent(getGoogleApiClient()), SHOW_ACHIEVEMENTS_REQUEST);
        }
    }

    @ReactMethod
    public void showLeaderboard(String leaderboardId) {
        if (isSignedIn()) {
            getCurrentActivity().startActivityForResult(Games.Leaderboards.getLeaderboardIntent(getGoogleApiClient(), leaderboardId), SHOW_LEADERBOARD_REQUEST);
        }
    }

    @ReactMethod
    public void setLeaderboardScore(String leaderboardId, int by) {
        if (isSignedIn()) {
            Games.Leaderboards.submitScore(getGoogleApiClient(), leaderboardId, by);
        }
    }

    @ReactMethod
    public void achievementIncrement(String id, int by) {
        if (isSignedIn()) {
            Games.Achievements.increment(getGoogleApiClient(), id, by);
        }
    }

    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        if (getGoogleApiClient().isConnected()) {
            getGoogleApiClient().disconnect();
        }
        mActivityPromise = null;
    }
}
