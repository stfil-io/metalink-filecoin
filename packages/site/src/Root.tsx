import { createContext, FunctionComponent, ReactNode, useState } from 'react';
import {ThemeProvider} from "@material-ui/core/styles"
import {theme} from "./style/theme";

export type RootProps = {
  children: ReactNode;
};

type ToggleTheme = () => void;

export const ToggleThemeContext = createContext<ToggleTheme>(
  (): void => undefined,
);

export const Root: FunctionComponent<RootProps> = ({ children }) => {
  return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
  );
};
