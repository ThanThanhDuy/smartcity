import React, {useEffect, useState} from 'react'
import {Button, Input, notification, Table, Tag} from "antd";
import axiosClient from "../../apis";
import moment from "moment";
import './style.css'

const {Search} = Input;

const STATUS_RENDER = {
    1: {
        label: 'Booking',
        color: 'cyan'
    },
    2: {
        label: 'Working',
        color: 'blue'
    },
    3: {
        label: 'Finish',
        color: 'green'
    }
}

function Booking() {
    const [data, setData] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, title, des) => {
        api[type]({
            message: title,
            description: des
        });
    };

    useEffect(() => {
        const getData = async () => {
            const response = await axiosClient.get(`/Employees/bookings`);
            const res = await axiosClient.get('/BookingDetails')
            const resService = await axiosClient.get('/Services')

            // for (let i = 0; i < response.data.length; i++) {
            //     let service = []
            //     for (let j = 0; j < res.data.length; j++) {
            //         if (response.data[i].bookingId === res.data[j].bookingId) {
            //             response.data[i].price = res.data[j].price
            //             response.data[i].quantity = res.data[j].quantity
            //             response.data[i].totalPrice = res.data[j].totalPrice
            //
            //             service.push(res.data[j].serviceId)
            //         }
            //     }
            //     service = service.map((item) => {
            //         for (let j = 0; j < resService.data.length; j++) {
            //             if (item === resService.data[j].serviceId) {
            //                 return resService.data[j].serviceName
            //             }
            //         }
            //     })
            //     response.data[i].service = service.join(', ')
            // }
            setData(response.data);
        }
        getData();
    }, []);


    const columns = [
        {
            title: 'ID',
            dataIndex: 'bookingId',
            key: 'bookingId',
            width: 100,
        },
        {
            title: 'Amount Price',
            dataIndex: 'totalAmount',

        },
        {
            title: 'Employee Quantity',
            dataIndex: 'empQuantity',
        },
        {
            title: 'Date Of Booking',
            dataIndex: 'dateOfBooking',
            render: (_, {dateOfBooking}) => (
                <span>
                   {moment(dateOfBooking).format("DD-MM-YYYY")}
               </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'statusBooking',
            render: (_, {statusBooking}) => (
                <Tag color={STATUS_RENDER[statusBooking].color}>
                    {STATUS_RENDER[statusBooking].label}
                </Tag>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <div>
                    {
                        record.statusBooking === 1 &&
                        <Button type='primary' onClick={() => handleConfirm(record)}>Confirm</Button>
                    }

                </div>
            ),
        },
    ];

    async function handleConfirm(record) {
        try {
            let formData = new FormData();
            formData.append('bookingId', record.bookingId)
            formData.append('confirm', true)
            const response = await axiosClient.post(`/Employees/confirm-task`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (response.statusCode === 200) {
                const dataUpdate = data.map((item) => {
                    if (item.bookingId === record.bookingId) {
                        item.statusBooking = 2
                    }
                    return item
                })
                setData(dataUpdate)
                openNotificationWithIcon('success', 'Success', response.message)
            } else {
                openNotificationWithIcon('error', 'Error', response.message)
            }
        } catch (error) {
            console.log(error)
            openNotificationWithIcon('error', 'Error', error.message)
        }
    }

    const onSearch = (value) => {
        if (value) {
            const dataSearch = data.filter((item) => item.bookingId === parseInt(value))
            setData(dataSearch)
        } else {
            const getData = async () => {
                const response = await axiosClient.get(`/Employees/bookings`);
                setData(response.data);
            }
            getData();
        }
    }

    return <div>
        {contextHolder}
        <Table
            columns={columns}
            dataSource={data}
            bordered
            title={() => <Search
                className="search"
                placeholder="Seach By ID"
                onSearch={onSearch}
                style={{
                    width: 200,
                }}
            />}
            rowKey={(record) => record.bookingId}
        />
    </div>
}

export default Booking
