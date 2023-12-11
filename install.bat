
@echo off
set CURRENT_DIR=%cd%


@REM set APPS=%CURRENT_DIR% %CURRENT_DIR%/packages/application/app-vue-framework %CURRENT_DIR%/packages/application/app-vue

@REM for %%A in (%APPS%) do (
@REM     cd /D %%A
@REM     npm install
@REM     cd /D %CURRENT_DIR%
@REM     echo %%A end
@REM )

set APPSDIR=%CURRENT_DIR%/packages/chart-attribute %CURRENT_DIR%/packages/chart-config %CURRENT_DIR%/packages/data-source-edit

for %%A in (%APPSDIR%) do (
    cd /D %%A
    npm run build
    cd /D %CURRENT_DIR%
    echo %%A end
)