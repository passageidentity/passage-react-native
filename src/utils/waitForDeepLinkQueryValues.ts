import { AppState, Linking } from 'react-native';

const getUrlParamValue = (url: string, param: string): string | null => {
  const queryString = url.split('?')[1];
  const queryParams = queryString
    ? queryString.split('&').reduce((acc, current) => {
        const [key, value] = current.split('=');
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {} as Record<string, string>)
    : {};
  return queryParams[param] || null;
};

/**
 * Call this function when expecting a redirect into the application when the app has
 * become inactive or backgrounded.
 *
 * Note that this function works best in a "singleTask" Android app.
 *
 * @param parameters Array of parameters to return from Deep Link.
 * @returns object
 * @throws
 */
export const waitForDeepLinkQueryValues = async (parameters: string[]): Promise<{ [key: string]: string }> => {
  return new Promise(async (resolve, reject) => {
    // We need to listen for a Deep Link url event, and attempt to extract the parameters
    // from the redirect url.
    const linkingListener = Linking.addEventListener('url', async (event) => {
      appStateListener.remove();
      linkingListener.remove();
      const { url } = event;
      const result: { [key: string]: string } = {};
      for (let parameter of parameters) {
        const value = getUrlParamValue(url, parameter);
        if (!value) {
          return reject(new Error(`Missing query parameter ${parameter} in redirect url.`));
        }
        result[parameter] = value;
      }
      resolve(result);
    });
    // We need to listen for an AppState change event in the case that the user returns to
    // the app without having been redirected.
    // Note that appStateListener will NEVER be triggered before linkingListener.
    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (nextAppState !== 'active') return;
        appStateListener.remove();
        linkingListener.remove();
        reject(new Error('Operation canceled.'));
      }
    );
  });
};
