# Tray Icon Instructions

The Electron app needs a tray icon for the menu bar. Currently, the app will use an empty icon as a placeholder.

## To add a custom icon:

1. Create a tray icon image:
   - **macOS**: Use a template image (monochrome, transparent background)
   - Size: 16x16 or 22x22 pixels
   - Format: PNG with transparency
   - Save as: `assets/tray-iconTemplate.png` (for macOS)

2. For other platforms:
   - Regular PNG with color
   - Save as: `assets/tray-icon.png`

3. The app will automatically load the icon if the file exists.

## Creating a simple icon:

You can use any image editor to create a simple icon:
- Design: A simple "S" for Sentinel, or a sensor/antenna symbol
- Background: Transparent
- Color: White/black for template mode (macOS), or any color for other platforms

The icon file will be automatically detected when placed in the `assets/` directory.
