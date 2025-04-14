import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      {/* 
        // @ts-ignore */}
    <QueryClientProvider client={queryClient} contextSharing={true}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
