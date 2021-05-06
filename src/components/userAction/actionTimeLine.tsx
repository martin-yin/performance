import { Timeline } from 'antd'
import React, { FC, useCallback, useEffect, useState } from 'react'
import {
  PageClickIcon,
  PageLoadIcon,
  PageNetworkIcon,
  PageViewIcon,
  PageResoucesErrorIcon,
  PageJsErrorIcon
} from '../../assets'
import { UserAction } from '../../interface/user.interface'
import { getTimeHHMM } from '../../utils'

interface ActionTimeLineProps {
  key: number
  item: UserAction
  activeTimeLine: (item: UserAction) => void
  activeId: string
}

const ActionTimeLineItem: FC<ActionTimeLineProps> = ({ key, item, activeTimeLine, activeId }) => {
  const [itemData, setItemData] = useState({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    itemIcon: () => {
      return <></>
    },
    itemTitle: '',
    itemContent: ''
  })

  const initItemData = useCallback(async () => {
    const { icon, title, content } = transformationAction(item)
    setItemData({
      itemIcon: icon,
      itemTitle: content,
      itemContent: title
    })
  }, [item])

  useEffect(() => {
    initItemData()
  }, [initItemData])

  const transformationAction = (item: UserAction): any => {
    if (item.action_type == 'JS_ERROR') {
      return {
        icon: (): React.ReactNode => {
          return <img className="actionTimeLineImg" src={PageJsErrorIcon} />
        },
        title: `错误信息${item.message}`,
        content: `错误页面: ${item.page_url}`
      }
    } else if (item.action_type == 'RESOURCE_ERROR') {
      return {
        icon: (): React.ReactNode => {
          return <img className="actionTimeLineImg" src={PageResoucesErrorIcon} />
        },
        title: `资源加载错误${item.element_type}`,
        content: `资源URL: ${item.source_url}`
      }
    } else if (item.action_type == 'BEHAVIOR_INFO') {
      return {
        icon: (): React.ReactNode => {
          return <img className="actionTimeLineImg" src={PageClickIcon} />
        },
        title: '点击事件',
        content: `点击内容: ${item.innter_text}`
      }
    } else if (item.action_type == 'HTTP_LOG') {
      return {
        icon: (): React.ReactNode => {
          return <img className="actionTimeLineImg" src={PageNetworkIcon} />
        },
        title: '发送请求',
        content: `请求URL: ${item.http_url}`
      }
    } else if (item.action_type == 'PAGE_LOAD') {
      return {
        icon: (): React.ReactNode => {
          return <img className="actionTimeLineImg" src={PageLoadIcon} />
        },
        title: '打开页面',
        content: `页面URL: ${item.page_url}`
      }
    } else if (item.action_type == 'PAGE_VIEW') {
      return {
        icon: (): React.ReactNode => {
          return <img className="actionTimeLineImg" src={PageViewIcon} />
        },
        title: '页面浏览',
        content: `页面URL: ${item.page_url}`
      }
    }
  }
  return (
    <>
      <Timeline.Item key={key} dot={itemData.itemIcon()}>
        <div
          className={`footprint-des ${activeId == item.action_id + item.action_type ? 'active-footprint-des' : ''}`}
          onClick={() => activeTimeLine(item)}
        >
          <div className="flex">
            <div className="flex-grow-1">{itemData.itemTitle}</div>
            <div className="flex-grow-0 flex-item">{getTimeHHMM(item.happen_time)}</div>
          </div>
          <div>{itemData.itemContent}</div>
        </div>
      </Timeline.Item>
    </>
  )
}

export default ActionTimeLineItem