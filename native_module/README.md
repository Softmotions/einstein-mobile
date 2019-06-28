
# softmotions-einstein-native-module

## Getting started

`$ npm install softmotions-einstein-native-module --save`

### Mostly automatic installation

`$ react-native link softmotions-einstein-native-module`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `softmotions-einstein-native-module` and add `NativeModule.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libNativeModule.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.softmotion.einstein.NativeModulePackage;` to the imports at the top of the file
  - Add `new NativeModulePackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':softmotions-einstein-native-module'
  	project(':softmotions-einstein-native-module').projectDir = new File(rootProject.projectDir, 	'../node_modules/softmotions-einstein-native-module/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':softmotions-einstein-native-module')
  	```


## Usage
```javascript
import NativeModule from 'softmotions-einstein-native-module';

// TODO: What to do with the module?
NativeModule;
```
  