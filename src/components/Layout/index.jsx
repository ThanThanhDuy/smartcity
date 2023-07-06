'use client'
import {HomeOutlined, PoweroffOutlined, ProfileOutlined, UserOutlined} from '@ant-design/icons'
import {Breadcrumb, Button, Layout, Menu, theme} from 'antd'
import {useEffect, useState} from 'react'
import {Link, Outlet, useLocation} from 'react-router-dom'
import localService from "../../services/local";

const {Header, Content, Footer, Sider} = Layout

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label
    }
}

const breadcrumbNameMap = {
    1: 'Home',
    2: 'Account',
    3: 'Booking'
}

const breadcrumbNameMapIcon = {
    1: <HomeOutlined/>,
    2: <UserOutlined/>,
    3: <ProfileOutlined/>
}

const items = [
    getItem(<Link to="/home">Home</Link>, '1', <HomeOutlined/>),
    getItem(<Link to="/account">Account</Link>, '2', <UserOutlined/>),
    getItem(<Link to="/booking">Booking</Link>, '3', <ProfileOutlined/>),

]
const LayoutA = () => {
    const [collapsed, setCollapsed] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState([])
    const {
        token: {colorBgContainer}
    } = theme.useToken()
    const pathName = useLocation().pathname

    useEffect(() => {
        switch (pathName) {
            case '/home':
                setSelectedKeys(['1'])
                break
            case '/account':
                setSelectedKeys(['2'])
                break
            case '/booking':
                setSelectedKeys(['3'])
                break
            default:
                break
        }
    }, [])

    return (
        <Layout
            style={{
                minHeight: '100vh'
            }}
        >
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={value => setCollapsed(value)}
                theme="light"
            >
                <div className="demo-logo-vertical"/>
                <Menu
                    theme="light"
                    selectedKeys={selectedKeys}
                    mode="inline"
                    items={items}
                    onSelect={item => {
                        setSelectedKeys([item.key])
                    }}
                />
            </Sider>
            <Layout className="site-layout">
                <Header
                    style={{
                        padding: '0 16px',
                        background: colorBgContainer,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',

                        boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'
                    }}
                >
                    <h1>SmartCity Employee</h1>
                    <Button
                        onClick={() => {
                            localService.removeAccessToken()
                            window.location.href = '/login'
                        }}
                        icon={<PoweroffOutlined/>}
                        style={{
                            fontSize: '16px',
                            width: 40,
                            height: 40,
                            backgroundColor: '#321FDB',
                            color: '#fff'
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '0 16px'
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0'
                        }}
                    >
                        <Breadcrumb.Item>
                            <span>
                                {breadcrumbNameMapIcon[selectedKeys[0]]}
                            </span>
                        </Breadcrumb.Item>
                        {breadcrumbNameMap[selectedKeys[0]] && (
                            <Breadcrumb.Item>
                                <span>
                                    {breadcrumbNameMap[selectedKeys[0]]}
                                </span>
                            </Breadcrumb.Item>
                        )}
                    </Breadcrumb>
                    <Outlet/>
                </Content>
                {/*<Footer*/}
                {/*    style={{*/}
                {/*        textAlign: 'center'*/}
                {/*    }}*/}
                {/*>*/}
                {/*    Ant Design ©2023 Created by Ant UED*/}
                {/*</Footer>*/}
            </Layout>
        </Layout>
    )
}
export default LayoutA
