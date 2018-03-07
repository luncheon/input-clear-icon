node "%~dp0_svg-stroke.js"
xcopy /i "%~dp0.temp\svg-stroke" "%~dp0.temp\svg-fill"
for %%i in ("%~dp0.temp\svg-fill\*.svg") do (
  "C:\Program Files\Inkscape\inkscape.exe" --verb EditSelectAll --verb StrokeToPath --verb FileSave --verb FileQuit %%i
)
node "%~dp0_css-from-fill-svgs.js"
pause
