# Sentinel Sensor (Electron)

A React + Electron sensor application that connects to the HQ server.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development mode:
```bash
npm run electron:dev
```

This will start Vite dev server and Electron app.

## Building

Build for production (macOS):
```bash
npm run electron:build
```

This will:
1. Build the React app with Vite
2. Package the Electron app for macOS
3. Generate three output formats in the `dist/` folder:
   - `mac/sentinel-sensor.app` - macOS application bundle (can be run directly or moved to `/Applications`)
   - `sentinel-sensor-1.0.0.dmg` - Disk image for distribution
   - `sentinel-sensor-1.0.0-mac.zip` - ZIP archive for alternative distribution

### Icon Requirements

The app uses `assets/icon.icns` for the application icon. If the file doesn't exist, electron-builder will use a default icon. To use a custom icon:

1. Create or convert an image to `.icns` format
2. Place it at `assets/icon.icns`
3. The icon should include multiple sizes (typically 16x16, 32x32, 128x128, 256x256, 512x512, 1024x1024)

You can use tools like `iconutil` (macOS) or online converters to create `.icns` files from PNG images.

## Configuration

The sensor connects to the HQ server at `http://localhost:3000` by default.

To change the HQ server URL, set the `HQ_SERVER_URL` environment variable:
```bash
HQ_SERVER_URL=http://your-hq-server:3000 npm run electron:dev
```

## Features

- Connects to HQ server via heartbeat API
- Displays connection status, system health, and metrics
- Shows real-time sensor telemetry data
- Sends alerts to HQ server
- Receives policies from HQ server
