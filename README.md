Created native module with:
`react-native-create-library --prefix '' --module-prefix softmotions-einstein --package-identifier com.softmotions.einstein.modules --platforms ios,android native_module`

Now native apps can be regenerated (for future RN updates) with:
`npm run native:gen`

! Dont forget to install splash screen
https://github.com/crazycodeboy/react-native-splash-screen

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

And use this guide to sign app for GP:
https://facebook.github.io/react-native/docs/signed-apk-android