# Uber App Launch Mechanism in Rideshare Sniper

In the Rideshare Sniper app, the functionality to open the Uber app is implemented in the `StartSniperButton.tsx` component using **deep linking**. Here's how it works:

- **Trigger**: When you press the "START SNIPER" button, the app checks if all necessary permissions (location, notifications, and overlay) are granted using the `areAllPermissionsGranted()` function from the settings store.
- **Permissions Check**: If permissions are granted, the app proceeds to show an overlay demo and attempts to launch the Uber app. If not, it displays an alert prompting you to grant permissions in the settings.
- **Deep Linking**: The app uses the `Linking` module from React Native to attempt opening the Uber Driver app with the URL scheme `uber-driver://`. If the device has the Uber Driver app installed, it will open. If not, the app falls back to trying the regular Uber app with `uber://`.
- **Platform Limitation**: This deep linking functionality is only available on mobile platforms (iOS and Android) and is disabled on the web. The code includes a check (`Platform.OS !== 'web'`) to ensure it only runs on native environments.

This approach allows the app to seamlessly integrate with Uber's ecosystem by automatically launching the appropriate app when you start the sniper mode, provided all permissions are in place.