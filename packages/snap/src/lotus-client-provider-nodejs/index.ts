import BrowserProvider from '../lotus-client-provider-browser'
import WebSocket from "ws";

type TokenCallback = () => string;

export interface ProviderOptions {
    wsUrl?: string;
    httpUrl?: string;
    importUrl?: string;
    transport?: "http" | "ws";
    token?: string | TokenCallback;
    WebSocket?: WebSocket;
    sendHttpContentType?: string;
    fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  }

export class NodejsProvider extends BrowserProvider {
  constructor (url: string, options?: ProviderOptions) {
    super(url, {
      WebSocket,
      fetch,
      ...options
    })
  }
}