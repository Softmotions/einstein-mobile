Created native module with:
`react-native-create-library --prefix '' --module-prefix softmotions-einstein --package-identifier com.softmotions.einstein.modules --platforms ios,android native_module`

Now native apps can be regenerated (for future RN updates) with:
`npm run native:gen`