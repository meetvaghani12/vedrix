# Vedrix Frontend

AI-powered plagiarism detection web application.

## Environment Configuration

This application requires Google API credentials for the similarity search feature to work properly.

### Setting up Environment Variables

You have several options to configure the required environment variables:

#### Option 1: Edit the env-config.js file directly

1. Open `public/env-config.js`
2. Replace the placeholder values with your actual API keys:

```javascript
window.env = {
  // Google API configuration
  REACT_APP_GOOGLE_API_KEY: 'your_actual_google_api_key',
  REACT_APP_GOOGLE_SEARCH_ENGINE_ID: 'your_actual_search_engine_id',
};
```

#### Option 2: Use environment variables

1. Create a `.env` file in the root of the frontend directory with:

```
VITE_GOOGLE_API_KEY=your_actual_google_api_key
VITE_GOOGLE_SEARCH_ENGINE_ID=your_actual_search_engine_id
```

2. Run the application normally - the environment variables will be picked up by the set-env.js script and used to generate the env-config.js file.

### Getting Google API Credentials

1. Create a Google Cloud Project at https://console.cloud.google.com/
2. Enable the Custom Search API
3. Create API credentials
4. Set up a Programmable Search Engine at https://programmablesearchengine.google.com/

## Development

To run the development server:

```bash
npm run dev
```

## Building for Production

```bash
npm run build
``` 