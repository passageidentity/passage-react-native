import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'passage-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const PassageReactNative = NativeModules.PassageReactNative
  ? NativeModules.PassageReactNative
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return PassageReactNative.multiply(a, b);
}

export function registerWithPasskey(identifier: string): Promise<any> {
  return PassageReactNative.registerWithPasskey(identifier);
}
