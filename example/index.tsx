import * as React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => <div>console-tag example</div>;

createRoot(document.getElementById('root')!).render(<App />);
