import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.116759ca50aa4f589d437ea4c37eb954',
  appName: 'PsyDx',
  webDir: 'dist',
  // NOTE: The `server.url` block below enables hot-reload from the Lovable
  // sandbox during development. It is commented out by default so production
  // builds load bundled `dist/` assets and work fully offline. Uncomment it
  // ONLY while developing against the live sandbox.
  // server: {
  //   url: 'https://116759ca-50aa-4f58-9d43-7ea4c37eb954.lovableproject.com?forceHideBadge=true',
  //   cleartext: true,
  //   androidScheme: 'https',
  // },
  android: {
    backgroundColor: '#064E3B',
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#064E3B',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#064E3B',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
