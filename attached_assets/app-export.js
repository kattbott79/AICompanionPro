// index.js - Main entry point for the application

import React from 'react';
import ReactDOM from 'react-dom';
import AgentCreatorApp from './Main';
import './index.css';

// Render the application
ReactDOM.render(
  <React.StrictMode>
    <AgentCreatorApp />
  </React.StrictMode>,
  document.getElementById('root')
);

// index.css - Basic styles for the application
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  height: 100%;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  height: 100%;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
*/