#!/bin/bash

CURRENT_DIR=$(pwd)

APPS=("$CURRENT_DIR" "$CURRENT_DIR/packages/application/app-vue-framework" "$CURRENT_DIR/packages/application/app-vue")

for app in "${APPS[@]}"
do
    cd $app
    npm install
    cd -
done


APPS_BUILD=("$CURRENT_DIR/packages/chart-attribute" "$CURRENT_DIR/packages/chart-config" "$CURRENT_DIR/packages/data-source-edit" "$CURRENT_DIR/packages/grid-layout-wc")

for app in "${APPS_BUILD[@]}"
do
    cd  $app
    npm run build
    cd -
done