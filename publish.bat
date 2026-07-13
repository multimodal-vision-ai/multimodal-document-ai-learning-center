@echo off

echo.
echo ============================================
echo Multimodal Vision AI Learning Center
echo ============================================
echo.

set /p msg=Please enter Commit Message: 

git add .
git commit -m "%msg%"
git push

echo.
echo Publish Completed!
pause