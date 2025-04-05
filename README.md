# Unified Authentication UI

Unified Authentication UI is a web application designed to provide a seamless and centralized authentication experience. It supports features like login, logout, session management, and API key management.

## Features

- **User Authentication**: Login and logout functionality.
- **Session Management**: Automatic session refresh using tokens.
- **API Key Management**: Create, view, and delete API keys.
- **OAuth Integration**: Support for third-party OAuth providers.

## Prerequisites

- Node.js (v16 or later)  <!-- Required runtime for the application -->
- npm or yarn             <!-- Package managers for installing dependencies -->
- A running backend API for authentication <!-- Backend dependency -->

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/avalokkumar/unified-auth-ui.git
   cd unified-auth-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3000/api  # Backend API URL
   VERCEL_TOKEN=your-vercel-token                 # Token for Vercel deployment
   ```

## Usage

### Development

To start the development server:
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

### Build for Production

To build the application for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

### Run Tests

To run unit tests:
```bash
npm test
```

To run end-to-end tests using Cypress:
```bash
npm run cypress:open
```

## Folder Structure

- **`src/`**: Contains the source code.
  - **`pages/`**: Next.js pages.
  - **`services/`**: API service files.
  - **`lib/`**: Utility functions like token management.
- **`.env.local`**: Environment variables for local development.

## API Endpoints

- **`/auth/login`**: Login endpoint.
- **`/auth/logout`**: Logout endpoint.
- **`/auth/refresh`**: Refresh session token.
- **`/api-keys`**: API key management.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
