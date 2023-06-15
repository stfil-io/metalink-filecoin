# MetaLinkFilecoin types
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

MetaLinkFilecoin types defines the `Messages` and snap interaction `MetaLinkFilecoin Snap API`.

## API Documentation

### MetaLinkFilecoin Snap API

<details>
<summary style="font-weight: bold">configure</summary>

```
configure(configuration: Partial<SnapConfig>): Promise<void>
```

Configures snap for the specific network. It is possible to send custom configuration or select one from a set of predefined configurations by defining specific `network`.

There are two predefined configurations for testnet `"t"` and for mainet `"f"`. If selecting a predefined configuration only `network` property is required.

```typescript
export interface SnapConfig {
  derivationPath: string;
  network: FilecoinNetwork;
  rpc: {
    token: string;
    url: string
  };
  unit?: UnitConfiguration;
}
```

It is also possible to choose a predefined configuration and only change some specific properties. In the example `SnapConfig` below we selected predefined configuration for testnet network and only changed URL for RPC endpoint (`rpcUrl`), all other properties will be the same as in predefined configuration for testnet network.

```
{
  network: "t",
  rpc: {
    token: "",
    url: "test.rpc.url"
  },
}
```
</details>

<details>
<summary style="font-weight: bold">getPublicKey</summary>

```
getPublicKey(): Promise<string>
```

Returns the public key for the generated account.
</details>

<details>
<summary style="font-weight: bold">getAddress</summary>

```
getAddress(): Promise<string>
```

Returns address for the generated account.
</details>

<details>
<summary style="font-weight: bold">getBalance</summary>

```
getBalance(): Promise<string>
```

Return balance for the generated account.
</details>

<details>
<summary style="font-weight: bold">exportPrivateKey</summary>

```
exportPrivateKey(): Promise<string>
```

Return private key for the generated account.

_This method will invoke Metamask prompt to confirm action_
</details>

### Messages

Sending a message is a two-step process (sign message, send message). First, create `SignedMessage` using `signMessage` method then send a signed message using `sendMessage` method. Additionally it is possible to estimate gas parameters with `calculateGasForMessage` method.

<details>
<summary style="font-weight: bold">calculateGasForMessage</summary>

```
calculateGasForMessage(message: MessageRequest, maxFee?: string): Promise<MessageGasEstimate>
```

The function accepts message request object and additional optional parameter for maximum allowed fee (if omitted this will be set to 0.1 FIL)

```typescript
interface MessageRequest {
  to: string;
  value: string;
  gaslimit?: number;   // leave empty
  gasfeecap?: string;  // leave empty
  gaspremium?: string; // leave empty
  nonce?: number;      // leave empty
}
```

Returns `MessageGasEstimate` with estimated values for gas parameters for the provided message, see below.

```typescript
interface MessageGasEstimate {
  gaslimit: number;
  gasfeecap: string;
  gaspremium: string;
  maxfee: string
}
```
</details>

<details>
<summary style="font-weight: bold">signMessage</summary>

```
signMessage(message: MessageRequest): Promise<SignMessageResponse>
```

If gas parameters are left out then they will be filled with estimates (see `estimateMessageGas` function).

```typescript
interface MessageRequest {
  to: string;
  value: string;
  gaslimit?: number;
  gasfeecap?: string;
  gaspremium?: string;
  nonce?: number;
}
```

Returns `SignMessageResponse` with information on sign request status.

```typescript
interface SignMessageResponse {
  signedMessage: SignedMessage // signed message if sucesfull, null otherwise
  confirmed: boolean // information if user accepted to sign message
  error: Error // null if everything was sucessfull
}
```

If signing was successful you can find all message details and generated signature inside `signedMessage` prop, see below.

```typescript
interface SignedMessage {
  message: Message;
  signature: MessageSignature;
}

interface Message {
  to: string;
  from: string;
  nonce: number;
  value: string;
  gasfeecap: string;
  gaspremium: string;
  gaslimit: number;
  method: number;
  params?: string;
}

interface MessageSignature {
  data: string;
  type: number;
}
```
</details>

<details>
<summary style="font-weight: bold">signMessageRaw</summary>

```
signMessageRaw(message: string): Promise<SignRawMessageResponse>
```

```typescript
interface SignRawMessageResponse {
  signature: string
  confirmed: boolean
  error: Error
}
```
</details>

<details>
<summary style="font-weight: bold">sendMessage</summary>

```
sendMessage(signedMessage: SignedMessage): Promise<MessageStatus>
```

```typescript
export interface SignedMessage {
  message: Message;
  signature: {
    data: string;
    type: number;
  };
}
```
</details>

<details>
<summary style="font-weight: bold">getMessages</summary>

```
getMessages(): Promise<MessageStatus[]>
```

Returns all messages saved inside the snap state (all messages sent through Filecoin snap) as `MessageStatus`.

```typescript
interface MessageStatus {
  message: Message;
  cid: string;
}
```

It holds information about message parameters as `Message` and a unique code identifier for the message or **CID**.

```typescript
interface Message {
  to: string;
  from: string;
  nonce: number;
  value: string;
  gasfeecap: string;
  gaspremium: string;
  gaslimit: number;
  method: number;
  params?: string;
}
```
</details>

## MetaLinkFilecoin Snap API usage examples

### Send message

```typescript
// snap is already installed
const api = await MetaLinkFilecoinSnap.getApi();

const toAddress = "t1wnanhvadbski2fru4l4kry3x2hqq4jobzzic6dq"
const amountAttoFIL = "100000"

const gasEstimate = await api.calculateGasForMessage({
  to: toAddress,
  value: amountAttoFIL,
});

const partialMessage: PartialMessage = {
  to: toAddress,
  value: amountAttoFIL,
  gaslimit: gasEstimate.gaslimit,
  gasfeecap: gasEstimate.gasfeecap,
  gaspremium: gasEstimate.gaspremium,
}

const response: SignMessageResponse = await api.signMessage(partialMessage);
const messageCid = await api.sendMessage(response.signedMessage);

console.log(`Message sent with cid: ${messageCid["/"]}`);
```
