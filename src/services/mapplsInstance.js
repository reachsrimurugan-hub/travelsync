import { mappls } from 'mappls-web-maps';
import { getMapplsToken } from './mapService';

let mapplsApi = null;
let initialized = false;
let initPromise = null;

export const getMapplsApi = () => {
  if (!mapplsApi) mapplsApi = new mappls();
  return mapplsApi;
};

export const ensureMapplsReady = () => {
  const token = getMapplsToken();
  if (!token) {
    return Promise.reject(new Error('Mappls API key is not configured'));
  }
  if (initialized) return Promise.resolve(getMapplsApi());
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    try {
      getMapplsApi().initialize(
        token,
        { map: true, version: '3.0', libraries: [''], plugins: [''] },
        () => {
          initialized = true;
          resolve(getMapplsApi());
        }
      );
    } catch (err) {
      initPromise = null;
      reject(err);
    }
  });

  return initPromise;
};
