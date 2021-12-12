

; 开机自启
; !ifndef BUILD_UNINSTALLER
;   Function AutoStartup
;       WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "vue-cli-electron" "$INSTDIR\${PRODUCT_NAME}.exe"
;   FunctionEnd

;   !define MUI_FINISHPAGE_SHOWREADME
;   !define MUI_FINISHPAGE_SHOWREADME_Function AutoStartup
;   !define MUI_FINISHPAGE_SHOWREADME_TEXT "开机启动"
; !endif

!macro customInstall
  DeleteRegKey HKCR "vue-cli-electron"
  # 注册伪协议
  WriteRegStr HKCR "vue-cli-electron" "" "URL:vue-cli-electron"
  WriteRegStr HKCR "vue-cli-electron" "URL Protocol" ""
  WriteRegStr HKCR "vue-cli-electron\shell" "" ""
  WriteRegStr HKCR "vue-cli-electron\shell\Open" "" ""
  WriteRegStr HKCR "vue-cli-electron\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
  # 右键选中文件打开
  WriteRegStr HKCR "*\shell\vue-cli-electron" "" "用vue-cli-electron打开"
  WriteRegStr HKCR "*\shell\vue-cli-electron" "Icon" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "*\shell\vue-cli-electron\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%1"'
  # 右键选中文件夹打开
  WriteRegStr HKCR "Directory\shell\vue-cli-electron" "" "用vue-cli-electron打开"
  WriteRegStr HKCR "Directory\shell\vue-cli-electron" "Icon" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "Directory\shell\vue-cli-electron\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%V"'
  # 进入文件夹打开当前目录
  WriteRegStr HKCR "Directory\Background\shell\vue-cli-electron" "" "用vue-cli-electron打开"
  WriteRegStr HKCR "Directory\Background\shell\vue-cli-electron" "Icon" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "Directory\Background\shell\vue-cli-electron\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%V"'
!macroend

!macro customUnInstall
  DeleteRegKey HKCR "vue-cli-electron"
  DeleteRegKey HKCR "*\shell\vue-cli-electron"
  DeleteRegKey HKCR "Directory\shell\vue-cli-electron"
  DeleteRegKey HKCR "Directory\Background\shell\vue-cli-electron"
  ; DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "vue-cli-electron"
!macroend