@echo off
REM Starland Water Company Management System - Windows Deployment Script

echo ===========================================
echo Starland Water Company Management System
echo Windows Deployment Script
echo ===========================================

REM Check if running with proper permissions
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with administrator privileges
) else (
    echo Warning: Not running as administrator
)

REM Validate that we're in the correct directory
if not exist "index.html" (
    echo ERROR: index.html not found!
    echo This script must be run from the root directory of the project.
    pause
    exit /b 1
)

if not exist "js" (
    echo ERROR: js directory not found!
    echo This script must be run from the root directory of the project.
    pause
    exit /b 1
)

if not exist "css" (
    echo ERROR: css directory not found!
    echo This script must be run from the root directory of the project.
    pause
    exit /b 1
)

echo INFO: Project structure validated

REM Create backup
echo INFO: Creating backup of current system...
set BACKUP_DIR=backup_%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_DIR=%BACKUP_DIR: =0%

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Copy essential files to backup
if exist "index.html" copy "index.html" "%BACKUP_DIR%\"
if exist "css" xcopy /E /I "css" "%BACKUP_DIR%\css" >nul
if exist "js" xcopy /E /I "js" "%BACKUP_DIR%\js" >nul
if exist "entry" xcopy /E /I "entry" "%BACKUP_DIR%\entry" >nul
if exist "management" xcopy /E /I "management" "%BACKUP_DIR%\management" >nul
if exist "admin" xcopy /E /I "admin" "%BACKUP_DIR%\admin" >nul

echo INFO: Backup created in: %BACKUP_DIR%

REM Validate configuration
echo INFO: Validating configuration files...

if not exist "js\supabase.js" (
    echo ERROR: Configuration file js\supabase.js not found!
    pause
    exit /b 1
)

REM Check for demo configuration
findstr /C:"uqqxcuqflasmdjcbhnwb.supabase.co" "js\supabase.js" >nul
set SUPABASE_URL_FOUND=%errorlevel%

findstr /C:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" "js\supabase.js" >nul
set SUPABASE_KEY_FOUND=%errorlevel%

if %SUPABASE_URL_FOUND%==0 if %SUPABASE_KEY_FOUND%==0 (
    echo WARNING: Using demo Supabase configuration. For production, update with your own Supabase project credentials.
    echo.
    echo To configure your own Supabase project:
    echo 1. Create an account at https://supabase.com
    echo 2. Create a new project
    echo 3. Update js\supabase.js with your Project URL and Anonymous Key
    echo 4. Run the SQL from db_init.sql in your Supabase SQL editor
    echo.
)

echo INFO: Configuration validation completed

REM Check for required files
echo INFO: Checking for required files...

set FILES_TO_CHECK=index.html css\main.css js\supabase.js js\auth.js js\entry.js js\dashboard.js entry\sales.html management\dashboard.html db_init.sql SETUP_GUIDE.md USER_MANUAL.md

set MISSING_FILES=

for %%f in (%FILES_TO_CHECK%) do (
    if not exist "%%f" (
        set MISSING_FILES=!MISSING_FILES! %%f
    )
)

if not "%MISSING_FILES%"=="" (
    echo ERROR: Missing required files:
    for %%f in (%MISSING_FILES%) do (
        echo   - %%f
    )
    pause
    exit /b 1
)

echo INFO: All required files present

REM Run basic tests
echo INFO: Running deployment tests...

REM Check if HTML files exist and have content
for %%f in (*.html) do (
    if exist "%%f" (
        if /I "%%f" neq "deploy.bat" (
            if /I "%%f" neq "init_db.html" (
                if /I "%%f" neq "clear_storage.html" (
                    for %%g in ("%%f") do (
                        if %%~zg LSS 100 (
                            echo WARNING: File %%f is unusually small
                        )
                    )
                )
            )
        )
    )
)

echo INFO: Basic tests completed

REM Show summary
echo.
echo ===========================================
echo DEPLOYMENT SUMMARY
echo ===========================================
echo INFO: ^<^< System files validated
echo INFO: ^<^< Configuration checked
echo INFO: ^<^< Basic tests passed
echo.

echo NEXT STEPS:
echo 1. For development/testing: Simply open index.html in your browser
echo 2. For production deployment:
echo    - Configure your own Supabase project (see SETUP_GUIDE.md)
echo    - Upload all files to your web server
echo    - Run database initialization script (db_init.sql)
echo    - Test all functionality
echo.
echo DOCUMENTATION:
echo - Setup Guide: SETUP_GUIDE.md
echo - User Manual: USER_MANUAL.md
echo - Project Info: README.md
echo.

echo INFO: Deployment preparation completed successfully!
echo.
echo ===========================================

REM Ask if user wants to open the system
set /p response="Would you like to open the system in your default browser? (y/n): "
if /I "%response%"=="y" (
    start "" "%cd%\index.html"
    echo INFO: Opening system in browser...
)

echo.
echo INFO: Deployment script completed!
pause