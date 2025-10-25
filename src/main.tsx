import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// ADD THESE TWO LINES:
import { analyticsService } from './services/analytics.service'
analyticsService.initialize();

createRoot(document.getElementById("root")!).render(<App />);