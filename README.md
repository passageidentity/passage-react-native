<img src="https://storage.googleapis.com/passage-docs/passage-logo-gradient.svg" alt="Passage logo" style="width:250px;"/>

### Native passkey authentication for your React Native app
## Welcome!
Integrating passkey technology can be really hard. That's why we built the Passage React Native SDK - to make passkey authentication easy for you and your users, all in a native Android and iOS experience.

<img width="1069" alt="Screenshot 2023-05-15 at 5 42 31 PM" src="https://github.com/passageidentity/passage-android/assets/16176400/fc1acb9f-0eb7-4a8f-99b9-55be4459bfee">

<br>
<br>

## Installation

```sh
npm install passage-react-native
```

## Configuration
* [Configure your Android app](https://docs.passage.id/mobile/android/add-passage)
* [Configure your iOS app](https://docs.passage.id/mobile/ios/add-passage)

## Example Usage

```ts
import Passage from 'passage-react-native';

// Register a new user with a passkey
const { authToken } = await Passage.registerWithPasskey('name@email.com');

// Get authenticated user info
const user = await Passage.getCurrentUser();
```


## Documentation
To get started using Passage in your React Native app, please visit our [Passage Docs](https://docs.passage.id/mobile/react-native/).

