import { FunctionComponent, ReactNode } from 'react';
import {Dashboard} from "./containers/Dashboard/Dashboard";
import {MetaMaskContextProvider} from "./context/metamask";
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  .MuiBox-root {
    margin: 20px;
  }
`;

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <MetaMaskContextProvider>
          <Dashboard/>
      </MetaMaskContextProvider>
    </>
  );
};
