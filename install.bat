
@echo off
set CURRENT_DIR=%cd%


set APPS=%CURRENT_DIR% %CURRENT_DIR%/packages/application/app-vue-framework %CURRENT_DIR%/packages/application/app-vue

for %%A in (%APPS%) do (
    cd /D %%A
    npm install
    cd /D %CURRENT_DIR%
    echo %%A end
)

set APPSDIR=%CURRENT_DIR%/packages/chart-attribute %CURRENT_DIR%/packages/chart-config %CURRENT_DIR%/packages/data-source-edit

for %%A in (%APPSDIR%) do (
    cd /D %%A
    npm run build
    cd /D %CURRENT_DIR%
    echo %%A end
)