# MetaLinkFilecoin adapter
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![](https://img.shields.io/badge/yarn-%3E%3D1.16.0-orange.svg?style=flat-square)

MetaLinkFilecoin adapter is used to install MetaLinkFilecoin snap and expose API toward snap.

For more details on MetaLinkFilecoin snap itself see [snap repo](https://github.com/stfil-io/metalink-filecoin).

## Usage

Adapter has only exposed function for installing MetaLinkFilecoin snap.

```typescript
async function enableMetaLinkFilecoinSnap(
  config: Partial<SnapConfig>,
  snapOrigin?: string
): Promise<MetaLinkFilecoinSnap>
```

On snap installation, it is possible to send full or partial configuration.
If you only provide `network` property a predefined configuration for the specified network will be used.
Other properties are optional but will override default values if provided.

Below you can see structure of config object:

```typescript
export interface SnapConfig {
  derivationPath: string;
  token: string;
  network: FilecoinNetwork; // "f" || "t"
  rpcUrl: string;
  unit?: UnitConfiguration;
}

export interface UnitConfiguration {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
}
```

After snap installation, this function returns `MetaLinkFilecoinSnap` object that can be used to retrieve snap API.
An example of initializing MetaLinkFilecoin snap and invoking snap API is shown below.

```typescript
// install snap and fetch API
const snap = await enableMetaLinkFilecoinSnap({network: "t"});
const api = await MetaLinkFilecoinSnap.getApi();

// invoke API
const address = await api.getAddress();

console.log(`Snap installed, account generated with address: ${address}`);
```

For more details about exposed API see [API documentation](https://github.com/stfil-io/metalink-filecoin/blob/main/packages/types/README.md).
