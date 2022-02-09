import React from 'react';

interface DefaultImageState {
  uri?: string,
  author?: string,
  link?: string,
}

const defaultImageState: DefaultImageState = {
  uri: undefined,
  author: undefined,
  link: undefined,
};

const ImageContext = React.createContext(defaultImageState);
export default ImageContext;
