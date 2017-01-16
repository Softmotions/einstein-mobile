#!/bin/bash

echo Build APK release

cd android && ./gradlew assembleRelease && cd ../
