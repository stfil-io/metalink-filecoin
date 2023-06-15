# MetaLinkFilecoin
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![](https://img.shields.io/badge/yarn-%3E%3D1.16.0-orange.svg?style=flat-square)

MetaLinkFilecoin snap (plugin) enables Filecoin network inside Metamask and by doing this provides DAPPs easy integration.

## Architecture
MetaLinkFilecoin snap is installed using [metalink-filecoin-adapter](https://www.npmjs.com/package/@stfil/metalink-filecoin-adapter). Usage flow is represented in the diagram below.

![](https://github.com/stfil-io/metalink-filecoin/blob/main/packages/snap/images/metalink_filecoin_snap.png)

## How to integrate into the project

### Prerequisites

Add [metalink-filecoin-adapter](https://www.npmjs.com/package/@stfil/metalink-filecoin-adapter)  and [metalink-filecoin-types](https://www.npmjs.com/package/@stfil/metalink-filecoin-types) package to your project

```
npm i @stfil/metalink-filecoin-adapter
npm i @stfil/metalink-filecoin-types
```

### Steps for usage

#### Install snap
Install snap by calling `enableMetaLinkFilecoinSnap` from `@stfil/metalink-filecoin-adapter` package.

This will prompt the user to:
* accept the snap installation
* accept all snap permissions

This function accepts the configuration object for defining network properties, the same as configure method from `MetaLinkFilecoin Snap API`. After successful installation, it will return `MetaLinkFilecoinSnap` object.

### Invoke MetaLinkFilecoin Snap API
`MetaLinkFilecoinSnap` object has an exposed method for obtaining API `getApi`.

For more details about exposed API see [API documentation](https://github.com/stfil-io/metalink-filecoin/blob/main/packages/types/README.md).
