![Passage Swift](https://storage.googleapis.com/passage-docs/passage-github-banner.png)

[![npm version](https://badge.fury.io/js/@passageidentity%2Fpassage-react-native.svg)](https://badge.fury.io/js/@passageidentity%2Fpassage-react-native)

### Native passkey authentication for your React Native app
## Welcome!
Integrating passkey technology can be really hard. That's why we built the Passage Complete React Native SDK - to make passkey authentication easy for you and your users, all in a native Android and iOS experience.

<img width="1069" alt="Passage React Native" src="https://storage.googleapis.com/passage-docs/passage_react_native.png">

<br>

## Installation

```sh
npm i @passageidentity/passage-react-native
```
<br>

## Example Usage

```ts
import Passage from '@passageidentity/passage-react-native';

const passage = new Passage('APP_ID');

// Register a new user with a passkey
const { authToken } = await passage.registerWithPasskey('name@email.com');

// Get authenticated user info
const user = await passage.getCurrentUser();
```
<br>

## Documentation
To get started using Passage Complete in your React Native app, please visit our [Passage Docs](https://docs.passage.id/complete/react-native/add-passage).

---
<br />
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="https://storage.googleapis.com/passage-docs/logo-small-light.pngg" width="150">
    <source media="(prefers-color-scheme: dark)" srcset="https://storage.googleapis.com/passage-docs/logo-small-dark.png" width="150">
    <img alt="Passage Logo" src="https://storage.googleapis.com/passage-docs/logo-small-light.png" width="150">
  </picture>
</p>

<p align="center">Give customers the passwordless future they deserve. To learn more check out <a href="https://passage.1password.com">passage.1password.com</a></p>

<p align="center">This project is licensed under the MIT license. See the <a href="./LICENSE"> LICENSE</a> file for more info.</p>
