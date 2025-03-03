#!/bin/sh
set -e

npm ci
npm run migrations
npm run dev
