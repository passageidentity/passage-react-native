<img src="https://storage.googleapis.com/passage-docs/passage-logo-gradient.svg" alt="Passage logo" style="width:250px;"/>

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
