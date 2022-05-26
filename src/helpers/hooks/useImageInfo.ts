import { useEffect, useState } from 'react';
import { ENABLE_BACKGROUND } from '../../StorageKeys';
import { DefaultSettingsState, ImageInfo } from '../../types';
import getBaseURL from '../getBaseURL';
import useWindowSize from './useWindowSize';

/**
 * Handle initialization of an `ImageInfo` state.
 * Call the image background API and set an object.
 */
function useImageInfo(settings: DefaultSettingsState) {
  const [imageInfo, setImageInfo] = useState<ImageInfo | undefined>();

  const windowSize = useWindowSize();

  /**
   * Attempt to load and set a background image.
   */
  async function setBackgroundImage() {
    const res = await fetch(`${getBaseURL()}/api/getBackground`);
    if (res.status === 200) {
      const json = await res.json();

      setImageInfo({
        uri: json.uri,
        author: json.author,
        link: json.link,
      });
    }
  }

  useEffect(() => {
    if (!imageInfo && windowSize === 'landscape' && settings[ENABLE_BACKGROUND]) {
      setBackgroundImage()
        .catch(() => {
          /* eslint-disable-next-line */
          console.log('Unable to set background image.');
        });
    } else if (imageInfo && (windowSize !== 'landscape' || !settings[ENABLE_BACKGROUND])) {
      // Remove image
      setImageInfo(undefined);
    }
  }, [imageInfo, settings[ENABLE_BACKGROUND], windowSize]);

  return imageInfo;
}

export default useImageInfo;
