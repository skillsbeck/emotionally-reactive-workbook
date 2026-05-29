import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rileyhunt.emotionallyreactive',
  appName: 'Stop Being Emotionally Reactive',
  webDir: 'dist',
  server: {
    // Remove these two lines once Supabase env vars are baked into the build
    // They allow the app to connect to your Supabase backend
    allowNavigation: ['*.supabase.co']
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#f5f0e8',
    preferredContentMode: 'mobile',
    scheme: 'Emotionally Reactive'
  },
  android: {
    backgroundColor: '#f5f0e8',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: '#1e3a5f',
      showSpinner: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#1e3a5f'
    }
  }
};

export default config;
