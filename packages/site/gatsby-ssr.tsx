import { GatsbySSR } from 'gatsby';
import { App } from './src/App';
import { Root } from './src/Root';
import React from 'react';

export const wrapRootElement: GatsbySSR['wrapRootElement'] = ({ element }) => (
  <Root>{element}</Root>
);

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({ element }) => (
  <App>{element}</App>
);
