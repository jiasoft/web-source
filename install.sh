#!/bin/bash

@echo off
CURRENT_DIR=$(pwd)


APPS=("$CURRENT_DIR" "$CURRENT_DIR/packages/application/app-vue-framework" "$CURRENT_DIR/packages/application/app-vue")

for app in "${APPS[@]}"
do
    cd $app
    npm install
    cd -
done

APPSBUILD=("$CURRENT_DIR/packageschart-attribute" "$CURRENT_DIR/chart-config" "$CURRENT_DIR/data-source-edit")

for app in "${APPS[@]}"
do
    cd  $app
    npm run build
    cd -
done