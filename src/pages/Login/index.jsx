import React, { useState } from 'react'
import { Form, Input, Button, Modal } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import './index.css'
import axiosClient from '../../apis'
import localService from '../../services/local'
import { useNavigate } from 'react-router'

function Login() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onFinish = async values => {
        try {
            setLoading(true)
            const res = await axiosClient.post('/Authentication/employees', {
                userName: values.username,
                password: values.password
            })
            if (res) {
                localService.setAccessToken(res)
                navigate('/home')
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            Modal.error({
                title: 'Opp! Something went wrong!',
                content: <div></div>
            })
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}
        >
            <div
                style={{
                    border: '1.5px solid #ccc',
                    padding: '50px 30px',
                    borderRadius: '8px',
                    width: 350
                }}
            >
                <p style={{ fontSize: 28, margin: 0 }}>SmartCity Employee</p>
                <p
                    style={{
                        fontSize: 14,
                        margin: 0,
                        color: '#ccc',
                        marginBottom: 20,
                        marginTop: 5
                    }}
                >
                    Sign In to account
                </p>
                <Form name="basic" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!'
                            }
                        ]}
                        style={{ marginBottom: 15 }}
                    >
                        <Input
                            addonBefore={
                                <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!'
                            }
                        ]}
                    >
                        <Input.Password
                            addonBefore={
                                <LockOutlined className="site-form-item-icon" />
                            }
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            span: 16
                        }}
                        style={{ marginBottom: 0 }}
                    >
                        <Button
                            loading={loading}
                            type="primary"
                            htmlType="submit"
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Login
