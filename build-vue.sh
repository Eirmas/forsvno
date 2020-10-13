#!/bin/bash

cd ../forsvno-vue
yarn build

cd ../forsvno
npm run build

enonic project clean
enonic project build && enonic sandbox start --dev

