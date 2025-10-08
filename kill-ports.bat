@echo off
echo Killing processes on ports 3000, 5000, 5001...

REM Kill port 3000 (Frontend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    if not "%%a"=="0" (
        taskkill /PID %%a /F >nul 2>&1
    )
)

REM Kill port 5000 (Backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    if not "%%a"=="0" (
        taskkill /PID %%a /F >nul 2>&1
    )
)

REM Kill port 5001 (AI Backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do (
    if not "%%a"=="0" (
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo Done! All ports cleared.
pause
