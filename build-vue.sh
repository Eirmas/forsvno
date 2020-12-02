#!/bin/bash

cd ../forsvno-vue
yarn build

cd ../forsvno
npm run build

enonic project deploy --dev

