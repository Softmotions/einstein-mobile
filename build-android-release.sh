#!/bin/bash

echo Build APK release

cd android && ./gradlew bundleRelease && cd ../
