package com.softmotions.utils.play;

import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.util.Log;
import com.facebook.react.bridge.*;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.games.Games;

/**
 * @author Vyacheslav Tyutyunkov (tve@softmotions.com)
 */
public class PlayGamesModule extends ReactContextBaseJavaModule
        implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener, LifecycleEventListener {

    private static final int GOOGLE_SIGN_IN_REQUEST = 8615;

    private Promise mActivityPromise;

    private final GoogleApiClient mGoogleApiClient;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            Log.w("\n\ngms", "");
            if (requestCode == GOOGLE_SIGN_IN_REQUEST) {
                if (mActivityPromise != null) {
                    if (resultCode == Activity.RESULT_CANCELED) {
                        mActivityPromise.reject("gms", "canceled");
                    } else if (resultCode == Activity.RESULT_OK) {

                        mGoogleApiClient.connect();
                        return;
                    } else {
                        mActivityPromise.reject("gms", "unexpected");
                    }
                }
                mActivityPromise = null;
            }
        }
    };

    public PlayGamesModule(ReactApplicationContext reactContext) {
        super(reactContext);

        mGoogleApiClient = new GoogleApiClient.Builder(getReactApplicationContext())
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(Games.API).addScope(Games.SCOPE_GAMES)
                .build();

        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "PlayGames";
    }

    @Override
    public void onConnected(Bundle bundle) {
        Log.w("\n\ngms", "");
        if (mActivityPromise != null) {
            Log.w("\n\ngms", "");
            mActivityPromise.resolve(null);
            mActivityPromise = null;
        }
    }

    @Override
    public void onConnectionSuspended(int i) {
        Log.w("conenction suspended", "");
        mGoogleApiClient.connect();
    }

    @Override
    public void onConnectionFailed(ConnectionResult result) {
        Log.e("\n\ngms", "!!!");
        if (result.hasResolution()) {
            try {
                result.startResolutionForResult(getCurrentActivity(), GOOGLE_SIGN_IN_REQUEST);
            } catch (IntentSender.SendIntentException e) {
                mGoogleApiClient.connect();
            }
        } else {
            Dialog dialog = GoogleApiAvailability.getInstance()
                    .getErrorDialog(getCurrentActivity(), result.getErrorCode(), GOOGLE_SIGN_IN_REQUEST);
            if (dialog != null) {
                dialog.show();
            }
            mActivityPromise.reject("gms", "failed");
        }
    }

    @ReactMethod
    public boolean isSignedIn() {
        return mGoogleApiClient.isConnected();
    }

    @ReactMethod
    public void signIn(Promise promise) {
        Log.e("\n\ngms", "@@@");
        if (mGoogleApiClient.isConnected()) {
            Log.w("\n\ngms", "connected!!!");
            promise.resolve(null);
            return;
        }
        mActivityPromise = promise;
        mGoogleApiClient.connect();
    }

    @ReactMethod
    public void signOut(Promise promise) {
        if (mGoogleApiClient.isConnected()) {
            Games.signOut(mGoogleApiClient);
            mGoogleApiClient.disconnect();
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void achievementUnlock(String id) {
        Games.Achievements.unlock(mGoogleApiClient, id);
        showAchievements();
    }

    @ReactMethod
    private void showAchievements() {
        getCurrentActivity().startActivityForResult(Games.Achievements.getAchievementsIntent(mGoogleApiClient), 5001);
    }

    @ReactMethod
    public void showLeaderboard(String leaderboardId) {
        getCurrentActivity().startActivityForResult(Games.Leaderboards.getLeaderboardIntent(mGoogleApiClient, leaderboardId), 5002);
    }

    @ReactMethod
    public void setLeaderboardScore(String leaderboardId, int by){
        Games.Leaderboards.submitScore(mGoogleApiClient, leaderboardId, by);
    }

    @ReactMethod
    public void achievementIncrement(String id, int by) {
        Games.Achievements.increment(mGoogleApiClient, id, by);
    }

    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        if (mGoogleApiClient.isConnected()) {
            mGoogleApiClient.disconnect();
        }
        mActivityPromise = null;
    }
}
