import React from 'react'
import '../App.css'
import AppRoutes from './app_routes'

console.log(process.env);
function App() {
    return (
        <div className="App">
            <AppRoutes />
        </div>
    );
}

export default App;