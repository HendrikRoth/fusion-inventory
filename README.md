# Fusion-Inventory

This tool adds a inventory for your Autodesk Fusion 360 tool library.
The Fusion 360 tool library is synced by the help of Autodesk Forge Api.

This code is running at https://fusion-inventory.hendrikroth.com

## State

This is an early alpha release, please don't use it in production yet.

## Features

- Loading your Autodesk Fusion Tool libraries
- Managing inventory of your tools
- Rating of your tools
- QR-Scanning for adding or removing the tool amount
- Internationalization (de and en at the moment)
- Defining/addding own fields for your tools

## Todo

- Fusion 360 Plugin
- Optimizing code
- Adding tests

## Hosting instructions

In order to run this code, you have to register an account at Autodesk Forge and create an
app with `Data Management Api` access: https://forge.autodesk.com

### Docker

A docker image is available at hub.docker.com with the name `hendrikroth/fusion-inventory`.

You have to set the environment variables:
```
CLIENT_ID={your_app_id}
CLIENT_SECRET={your_app_secret}
```

The data is stored at `/usr/src/app/data`.

### Native

This is a nodejs project, please install npm (nodejs 10) on your host system.

```
npm install
npm run build
```

Start with `CLIENT_ID={your_app_id} CLIENT_SECRET={your_app_secret} npm run express:run`

