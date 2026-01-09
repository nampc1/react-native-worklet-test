# WDK React Native Showcase

This repository serves as a showcase for the **Wallet Development Kit (WDK)** features, demonstrating how to integrate wallet functionality into a React Native application using minimal and reusable UI components.

## Overview

The application provides a reference implementation for common wallet operations, utilizing `@tetherto/wdk-react-native-core` and `@tetherto/wdk-uikit-react-native`. It is designed to be a starting point or reference for developers building crypto-enabled mobile applications.

## Key Features

The showcase demonstrates the following core capabilities:

- **Wallet Configuration**: Setup and configuration of the WDK environment.
- **Account Management**: 
  - Get Account details
  - Manage Account
  - Get Balance
- **Transactions**:
  - Send Funds
  - Sign Messages

## Project Structure

The project is built with Expo and follows a modular structure:

- `src/app/features/`: Contains the core feature implementations (Wallet, Config).
- `src/components/`: Reusable UI components used throughout the showcase.
- `src/config/`: Configuration for chains and tokens.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Install dependencies:

   ```sh
   npm install
   ```

### Running the App

You can run the application on Android or iOS simulators, or physical devices.

**Android:**

```sh
npm run android
```

**iOS:**

```sh
npm run ios
```

## Dependencies

Key WDK dependencies included in this project:

- `@tetherto/wdk-react-native-core`
- `@tetherto/wdk-uikit-react-native`

## License

Apache-2.0