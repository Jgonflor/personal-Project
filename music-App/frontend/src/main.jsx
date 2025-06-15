import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider 

  domain='dev-wzvwr5jrreptn5ta.us.auth0.com' 
 clientId='i3zC77BRF9Ry4gKM4HsNhyKUjJe9vdjS' 
  authorizationParams={{
    redirect_uri: window.location.origin,
  }}
>

    <App />
    </Auth0Provider>
  </StrictMode>,
)
