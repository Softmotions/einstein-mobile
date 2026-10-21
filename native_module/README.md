# softmotions-einstein-native-module

Android native modules used by the Einstein puzzle game:

* `GameActivity` — keeps the screen on while a puzzle is active.
* `PlayGames` — Google Play Games Services (v1 SDK) sign-in, achievements and leaderboards.
* `Locale` — localized strings and the current locale from Android resources.

## Installation

The module is a local npm dependency of the application (`file:./native_module`) and is
autolinked by React Native. No manual linking is required.

The module resources (tile images, logo, translated strings) are merged into the application
automatically when it is built.
