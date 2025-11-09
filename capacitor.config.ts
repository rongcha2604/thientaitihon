import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thientaidatviet.app',
  appName: 'Thiên Tài Đất Việt',
  webDir: 'dist',
  server: {
    // Cho development - uncomment nếu muốn test trên device với local server
    // url: 'http://192.168.1.XXX:5173', // Thay XXX bằng IP máy của bạn
    // cleartext: true,
    
    // Production - comment server.url để dùng built-in files
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#FDFBF5',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
  android: {
    buildOptions: {
      keystorePath: undefined, // Path to keystore nếu muốn sign APK
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK_AAB', // APK hoặc AAB (Android App Bundle)
    },
    allowMixedContent: true, // Cho phép HTTP requests nếu cần
  },
};

export default config;

