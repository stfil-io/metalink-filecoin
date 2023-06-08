import { GatsbyBrowser } from 'gatsby';
import { App } from './src/App';
import { Root } from './src/Root';
import React from 'react';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => (
    <Root>{element}</Root>
);

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
}) => <App>{element}</App>;
