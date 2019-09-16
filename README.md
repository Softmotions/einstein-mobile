Created native module with:
`react-native-create-library --prefix '' --module-prefix softmotions-einstein --package-identifier com.softmotions.einstein.modules --platforms ios,android native_module`

Now native apps can be regenerated (for future RN updates) with:
`npm run native:gen`

! Dont forget to install splash screen
https://github.com/crazycodeboy/react-native-splash-screen

! Dont forget to install gif support
https://facebook.github.io/react-native/docs/image.html#gif-and-webp-support-on-android

! Dont forget to enable fullscreen mode, insert this to com.softmotions.einstein.MainActivity:
```
...

import android.view.WindowManager;

...

public class MainActivity extends ReactActivity {
  ...
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      ...
      runOnUiThread(new Runnable() {
          @Override
          public void run() {
              getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
          }
      });
      ...
  }
  ...
}
```

! Dont forget to update AndroidManifest, like this:
```
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:tools="http://schemas.android.com/tools"
  package="com.softmotions.einstein_test">

  <uses-permission android:name="android.permission.INTERNET"/>
  <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
  <uses-permission android:name="android.permission.READ_PHONE_STATE" tools:node="remove"/>

  <supports-screens android:smallScreens="false"
    android:requiresSmallestWidthDp="160"/>

  <application
    android:name=".MainApplication"
    android:label="@string/app_name"
    android:icon="@mipmap/icon"
    android:allowBackup="true"
    android:theme="@style/AppTheme">

    <meta-data android:name="com.google.android.gms.games.APP_ID" android:value="@string/app_id"/>

    <activity
      android:name=".MainActivity"
      android:label="@string/app_name"
      android:configChanges="keyboard|keyboardHidden|orientation|screenSize">
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>
    </activity>
    <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
  </application>

</manifest>
```

! Dont forget to update version code and name

And use this guide to sign app for GP, reduce file size and etc:
https://facebook.github.io/react-native/docs/signed-apk-android