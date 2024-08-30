import React from 'react';
import { createRoot } from "react-dom/client";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <App />
);

serviceWorker.unregister();