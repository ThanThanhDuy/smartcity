import React, {useEffect, useRef, useState} from 'react'
import {Button, Form, Input, message, notification, Select} from 'antd'
import './index.css'
import axiosClient from '../../apis'

const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}
const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
}

const formLayout = {labelCol: {span: 6}, wrapperCol: {span: 18}}
const {Option} = Select

function Account() {
    const [form] = Form.useForm()

    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [imageUrl, setImageUrl] = useState()
    const [user, setUser] = useState({})
    const oldUser = useRef({})
    const passwordRef = useRef('')
    const [loadingGetUser, setLoadingGetUser] = useState(false)
    const [listSkill, setListSkill] = useState([])
    const [listSkillSelected, setListSkillSelected] = useState([])
    const [listSkillRender, setListSkillRender] = useState([])
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, title, des) => {
        api[type]({
            message: title,
            description: des
        });
    };

    const handleChangeSelect = value => {
        setListSkillSelected(value)
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                setLoadingGetUser(true)
                const resAu = await axiosClient.get(`/Authentication/profile`)

                if (resAu && resAu.data) {
                    passwordRef.current = resAu.data.password
                    const res = await axiosClient.get(
                        `/Employees/${resAu.data.employeeId}`
                    )
                    if (res && res.data) {
                        setUser(res.data)
                        oldUser.current = res.data
                    }
                    const resSkill = await axiosClient.get(
                        `Skills/employee/${resAu.data.employeeId}`
                    )
                    if (resSkill && resSkill.data) {
                        setListSkillSelected(
                            resSkill.data.map(item => item.skillId)
                        )
                        setListSkillRender(
                            resSkill.data.map(item => item.skillName)
                        )
                    }
                    const resListSkill = await axiosClient.get(`/Skills`)
                    if (resListSkill && resListSkill.data) {
                        setListSkill(
                            resListSkill.data.map(item => {
                                return {
                                    label: item.skillName,
                                    value: item.skillId
                                }
                            })
                        )
                        if (resSkill && resSkill.data) {
                            const data = resSkill.data.map(item => {
                                return resListSkill.data.find(
                                    i => i.skillId === item.skillId
                                ).skillName
                            })
                            setListSkillRender(data)
                        }
                    }
                }
            } catch (error) {
                console.log(error)

            }
        }
        getUser()
    }, [])

    const handleAdd = async () => {
        const data = {
            employeeName: user.employeeName,
            fullName: user.fullName,

            image: user.image,
            employeePhone: user.employeePhone,
            employeeEmail: user.employeeEmail,
            listSkillId: listSkillSelected.map(item => {
                return {
                    skillId: item
                }
            }),
        }
        password ? data.password = password : data.password = passwordRef.current
        try {
            const res = await axiosClient.put(`/Employees`, data)
            if (res && res.statusCode === 200) {
                openNotificationWithIcon('success', 'Success', res.message)
            } else {
                openNotificationWithIcon('error', 'Error', res.message)
            }
        } catch (error) {
            console.log(error)
            openNotificationWithIcon('error', 'Error', error.message)
        }

    }

    return (
        <div
            style={{
                height: '100%',
                backgroundColor: '#fff',
                padding: 20,
                position: 'relative'
            }}
        >
            {contextHolder}
            <Form
                {...formLayout}
                layout="horizontal"
                form={form}
                style={{
                    maxWidth: 600
                }}
                fields={user && Object.keys(user).map(key => {
                    return {
                        name: [key],
                        value: user[key]
                    }
                })}
            >
                <Form.Item label="Employee Name:" name="employeeName" rules={[
                    {
                        required: true,
                        message: 'Please input your employee name!'
                    }
                ]}>
                    <Input
                        placeholder=""
                        value={user?.employeeName}
                        disabled={!isEdit}
                        onChange={e => {
                            setUser({
                                ...user,
                                employeeName: e.target.value
                            })
                        }}
                    />
                </Form.Item>
                {isEdit && (
                    <>
                        <Form.Item label="Password:" name="empPass">
                            <Input.Password placeholder="" value={password}
                                            onChange={e => setPassword(e.target.value)}/>
                        </Form.Item>
                        <Form.Item label="Confirm password:" name="empRePass" rules={[
                            {
                                validator: (rule, value, callback) => {
                                    if (password) {
                                        if (value && value !== password) {
                                            return Promise.reject('The two passwords that you entered do not match!')
                                        }
                                        return Promise.resolve()
                                    }
                                }
                            }
                        ]}>
                            <Input.Password placeholder="" value={rePassword}
                                            onChange={e => setRePassword(e.target.value)}/>
                        </Form.Item>
                    </>
                )}
                <Form.Item label="Full Name:" name="fullName" rules={[
                    {
                        required: true,
                        message: 'Please input your full name!'
                    }
                ]}>
                    <Input
                        placeholder=""
                        value={user?.fullName}
                        disabled={!isEdit}
                        onChange={e => {
                            setUser({
                                ...user,
                                fullName: e.target.value
                            })
                        }}
                    />
                </Form.Item>
                <Form.Item label="Employee Phone:" name="employeePhone" rules={[
                    {
                        required: true,
                        message: 'Please input your phone number!'
                    },
                    {
                        pattern: new RegExp('^(\\+\\d{1,2}\\s?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$'),
                        message: 'The input is not valid phone number!'
                    }
                ]}>
                    <Input
                        placeholder=""
                        value={user?.employeePhone}
                        disabled={!isEdit}
                        onChange={e => {
                            setUser({
                                ...user,
                                employeePhone: e.target.value
                            })
                        }}
                    />
                </Form.Item>
                <Form.Item label="Employee Email:" name="employeeEmail" rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!'
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!'
                    }
                ]}>
                    <Input
                        placeholder=""
                        value={user?.employeeEmail}
                        disabled={!isEdit}
                        onChange={e => {
                            setUser({
                                ...user,
                                employeeEmail: e.target.value
                            })
                        }}

                    />
                </Form.Item>
                <Form.Item
                    label="Skill:"
                    rules={[
                        {
                            required: true,
                            message: 'Please select your skill!'
                        }
                    ]}
                >
                    {isEdit ? (
                        <Select
                            mode="multiple"
                            size="small"
                            placeholder="Please select"
                            value={listSkillSelected}
                            onChange={handleChangeSelect}
                            style={{
                                width: '100%'
                            }}
                            options={listSkill}
                        />
                    ) : (
                        <Input
                            placeholder=""
                            value={listSkillRender.join(', ')}
                            disabled={!isEdit}
                        />
                    )}
                </Form.Item>
                <div
                    style={{display: 'flex', justifyContent: 'space-evenly'}}
                >
                    {isEdit && (
                        <div style={{display: 'flex', gap: 50}}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" onClick={handleAdd}>Add</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    onClick={() => {
                                        setIsEdit(false)
                                        setUser({...oldUser.current})
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Form.Item>
                        </div>
                    )}
                </div>
            </Form>
            {!isEdit && (
                <div style={{position: 'absolute', top: 20, right: 20}}>
                    <Button onClick={() => setIsEdit(true)} type="primary">
                        Edit profile
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Account
