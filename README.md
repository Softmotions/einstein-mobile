# Einstein mobile

Android version of the Einstein puzzle game, based on React Native.

![screenshot](./readme_assets/screenshot.webp | width=100) ![screenshot](./readme_assets/screenshot_1.webp | width=100) ![screenshot](./readme_assets/screenshot_2.webp | width=100) ![screenshot](./readme_assets/screenshot_3.webp | width=100)

Use your brain to discover tiles. Based on the famous puzzle game contains nothing extra, pure logic - only symbols and rules. One wrong move and you fail, get smart and solve the puzzle.

[![get on google play](./readme_assets/google-play-badge.png)](https://play.google.com/store/apps/details?id=com.softmotions.einstein&hl=en)

## Building and install

Requirements:

* Node.js 20 or newer
* JDK 17
* Android SDK with platform 36, build-tools 36.0.0, NDK 27.1.12297006 and CMake 3.22.1

Install packages:

```sh
yarn
```

Start the Metro dev server:

```sh
yarn start
```

Build and install the debug application on a connected device or emulator:

```sh
yarn android
```

Build a release Android App Bundle (AAB):

```sh
./build-android-release.sh
```

The release build uses the keystore configured in `android/gradle.properties`:
`EINSTEIN_RELEASE_STORE_FILE`, `EINSTEIN_RELEASE_STORE_PASSWORD`,
`EINSTEIN_RELEASE_KEY_ALIAS` and `EINSTEIN_RELEASE_KEY_PASSWORD`.
If these properties are not set, the debug keystore is used.

Version code and version name are defined in `android/build.gradle`.

Run the unit tests with:

```sh
yarn test
```
