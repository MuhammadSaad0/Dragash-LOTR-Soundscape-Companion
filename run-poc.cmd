@echo off
setlocal
rem Optional first argument: your audiobook folder (containing Part1, Part2, Part3).
set "READER_AUDIO=%~1"
if not defined READER_AUDIO set "READER_AUDIO=%USERPROFILE%\Documents\LOTR-Audiobook"
start "" /b python "%~dp0local-server.py" --port 8765 --audio-directory "%READER_AUDIO%"
start "" "http://127.0.0.1:8765/index.html"
