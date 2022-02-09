import React from 'react';
import { DefaultImageState } from './src/types';

const defaultImageState: DefaultImageState = {
  imageInfo: undefined,
};

const ImageContext = React.createContext(defaultImageState);
export default ImageContext;
