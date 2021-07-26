# Einstein mobile

Its a cross-platform mobile version of einstein game. For IOS and Android, based on react-native.

![screenshot](./readme_assets/screenshot.webp | width=100) ![screenshot](./readme_assets/screenshot_1.webp | width=100) ![screenshot](./readme_assets/screenshot_2.webp | width=100) ![screenshot](./readme_assets/screenshot_3.webp | width=100)

Use your brain to discover tiles. Based on the famous puzzle game contains nothing extra, pure logic - only symbols and rules. One wrong move and you fail, get smart and solve the puzzle.

[![get on google play](./readme_assets/google-play-badge.png)](https://play.google.com/store/apps/details?id=com.softmotions.einstein&hl=en)  [![download from app store](./readme_assets/download-from-app-store.svg)](https://apps.apple.com/us/app/id1335910358)

## Building and install

* Install packages `yarn` or `npm install`
* Start react dev server `react-native start`
* Run on device or emulator `react-native run-android` or `react-native run-ios`

Created native module with:
`react-native-create-library --prefix '' --module-prefix softmotions-einstein --package-identifier com.softmotions.einstein.modules --platforms ios,android native_module`

Now native apps can be regenerated (for future RN updates) with:
`npm run native:gen`

! Dont forget to install splash screen
https://github.com/crazycodeboy/react-native-splash-screen

! Dont forget to install gif support
https://facebook.github.io/react-native/docs/image.html#gif-and-webp-support-on-android

! Dont forget to enable fullscreen mode, insert this to com.softmotions.einstein.MainActivity:

```java
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

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:tools="http://schemas.android.com/tools"
  package="com.softmotions.einstein_test">

  <uses-permission android:name="android.permission.INTERNET"/>
  <uses-permission android:name="android.permission.VIBRATE"/>
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