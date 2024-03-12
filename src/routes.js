import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login.js'
import App from './App.js'

function RoutesApp() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="home" element={<App/>}/>

            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp