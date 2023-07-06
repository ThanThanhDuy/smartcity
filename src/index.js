import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#321FDB'
                }
            }}
        >
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ConfigProvider>
    </>
)
