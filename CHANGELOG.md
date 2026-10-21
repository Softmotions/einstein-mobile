# Changelog

All notable changes to this project are documented in this file.

## v1.1.0

### Summary

Modernized the application to run on current Android versions. The project was
upgraded from React Native 0.59 / React 16 to React Native 0.81 / React 19 with
the New Architecture, and support for iOS was removed.

### Changed

- React Native `0.59.9` → `0.81.6`, React `16.8.6` → `19.1.4`.
- Enabled the New Architecture (Fabric + Hermes) and 16 KB page-size support.
- Android build: compile/target SDK 36, min SDK 24, JDK 17, Gradle 8.14.3,
  NDK 27.1.12297006, Kotlin `MainActivity`/`MainApplication`, AndroidX.
- Updated dependencies:
  - `@react-native-async-storage/async-storage` 2.2
  - `react-native-share` 12.3
  - `react-native-view-shot` 6.1
  - `react-native-vector-icons` 10.3
  - `redux` 5, `react-redux` 9, `redux-thunk` 3, `moment` 2.31
- Replaced the experimental navigation package with a small redux-based screen stack.
- Replaced `react-native-splash-screen` with a native splash window background.
- Version bumped to `1.1.0` (`versionCode 10100000`). Version code and version name are defined in `android/build.gradle`.

### Removed

- iOS project (`ios/`, iOS part of the native module, iOS tests and assets).
- Obsolete dependencies: `react-native-navigation-experimental-compat`,
  `react-native-splash-screen`, `@react-native-community/async-storage`,
  `redux-actions`.
- Legacy BUCK build files and old Flow configuration.

### Fixed

- Application no longer hangs after the splash screen on modern Android.
- React 19 compatibility issues (legacy lifecycle methods, removed event
  listener APIs, `CheckBox`, `InteractionManager`, class-field binding in
  derived components).
- Sharing a solved puzzle screenshot on modern Android (FileProvider path).
- Missing loading spinner asset (`loader.gif`).
- Duplicate Android support/AndroidX classes caused by the old Play Games SDK.
- Splash screen no longer shows through the application UI.

### Added

- Unit tests for puzzle generation/solving/restoring and navigation.
- Null-safety improvements in the Play Games native module.

### Notes

- Play Games Services uses the v1 SDK, which Google will stop serving in May 2027;
  migration to the v2 SDK is planned separately.
- Release build minification (R8) is disabled for safety.
- `minSdk` increased from 16 to 24.
