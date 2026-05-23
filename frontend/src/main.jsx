import { createRoot } from 'react-dom/client'
import { BrowserRouter,HashRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import {store} from "./store/index.js";
import { register } from './serviceWorkerRegistration.js';



 import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <HashRouter>
    <Provider store={store}>
     <App/>
    </Provider>
    </HashRouter>
)
register();