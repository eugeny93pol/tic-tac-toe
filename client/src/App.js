import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import openSocket from 'socket.io-client'
import {useRoutes} from './routes/routes'


export const socket = openSocket()

function App() {
    const routes = useRoutes()

    return (
            <Router>
                { routes }
            </Router>
    )
}

export default App
