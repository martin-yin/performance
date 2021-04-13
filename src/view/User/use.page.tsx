import React, { FC, useCallback, useEffect, useState } from 'react'
import { Card, Table, Space, Tag, DatePicker, Input, Select } from 'antd'
import './index.less'
import { GetUsers } from '../../request'
import { Link } from 'react-router-dom'
import { getTimeYYMMDDHM } from '../../utils'
import moment from 'moment'
const { Search } = Input
const { Option } = Select
const UserPage: FC = () => {
  const [userLst, setUserList] = useState([])
  const [timeLine, setTimeline] = useState([])
  const [userParams, setUserParams] = useState({
    search_date: moment().format('YYYY-MM-DD'),
    search_hour: '00:00'
  })

  const initData = useCallback(async () => {
    const result = await GetUsers(userParams)
    setUserList(result.data)
    const timeLine: any = []
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        timeLine.push(`0${i}:00`)
      } else {
        timeLine.push(`${i}:00`)
      }
    }
    setTimeline(timeLine)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    initData()
  }, [initData])

  const timeChange = (date: any, dateString: string) => {
    setUserParams({
      search_date: dateString,
      search_hour: userParams.search_hour
    })
  }

  const timeLineChange = (value: string) => {
    setUserParams({
      search_date: userParams.search_date,
      search_hour: value
    })
  }

  const onSearch = async (value: any) => {
    const result = await GetUsers({
      search_date: userParams.search_date,
      search_hour: userParams.search_hour,
      user_id: value
    })
    setUserList(result.data)
  }

  const columns = [
    {
      title: 'user_id',
      dataIndex: 'user_id',
      key: 'user_id'
    },
    {
      title: '设备',
      dataIndex: 'device',
      key: 'device',
      render: (text: string, recode: any) => {
        return (
          <div>
            {recode.device_type == 'Pc' ? (
              <Tag color="#2db7f5">
                {recode.device}/ {recode.device_type}
              </Tag>
            ) : (
              ''
            )}
            {recode.os == 'Android' ? (
              <Tag color="#87d068">
                {recode.device}/ {recode.device_type}
              </Tag>
            ) : (
              ''
            )}
            {recode.os == 'iOS' ? (
              <Tag color="#f50">
                {recode.device}/ {recode.device_type}
              </Tag>
            ) : (
              ''
            )}
          </div>
        )
      }
    },
    {
      title: '操作系统',
      dataIndex: '操作系统',
      key: 'system',
      render: (text: string, recode: any) => {
        return (
          <div>
            <Tag color="green">{`${recode.os} ${recode.os_version}`}</Tag>
          </div>
        )
      }
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      key: 'browser',
      render: (text: string, recode: any) => {
        return <div>{`${recode.browser} ${recode.browser_version}`}</div>
      }
    },
    {
      title: 'ip',
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: '位置',
      dataIndex: '位置',
      key: 'address',
      render: (text: string, recode: any) => {
        return <div>{`${recode.nation}${recode.province}${recode.city}${recode.district}`}</div>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'happen_time',
      key: 'happen_time',
      render: (text: string) => {
        return getTimeYYMMDDHM(text)
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, recode: any) => (
        <Space size="middle">
          <Link to={`/user-detail/${recode.id}`}>查看详情</Link>
        </Space>
      )
    }
  ]
  return (
    <>
      <div className="site-layout-content">
        <Card style={{ textAlign: 'right' }}>
          <Space>
            <DatePicker
              defaultValue={moment(userParams.search_date, 'YYYY-MM-DD')}
              onChange={timeChange}
              style={{ width: 160 }}
            />
            <Select defaultValue="00:00" style={{ width: 80 }} onChange={timeLineChange}>
              {timeLine.map((item: any, key) => (
                <Option value={item} key={key}>
                  {item}
                </Option>
              ))}
            </Select>
            <Search placeholder="user_id" style={{ width: 300 }} onSearch={onSearch} />
          </Space>
        </Card>
        <Card>
          <Table dataSource={userLst} columns={columns} rowKey="id" />
        </Card>
      </div>
    </>
  )
}

export default UserPage
