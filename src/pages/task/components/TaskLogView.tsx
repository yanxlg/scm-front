import React from 'react';
import "@/styles/config.less";
import { Card, Checkbox } from 'antd';
import TextArea from 'antd/es/input/TextArea';

class TaskLogView extends React.PureComponent{
    render(){
        return (
          <div className="config-console">
              <Card title="任务执行日志">
                  <div className="config-console-content"/>
              </Card>
              <Checkbox>窗口模式</Checkbox>
              <div className="config-console-tip">
                  执行任务过程中，支持文本展示及窗口展示，勾选【窗口模式】即可查看机器人实时操作
              </div>
          </div>
        )
    }
}

export default TaskLogView;
