import React from 'react';
import { Card, Tabs } from 'antd';
import {Bind} from 'lodash-decorators';
import HotGather from '@/pages/task/components/HotGather';
import "@/styles/index.less";

declare interface IConfigState {
    activeKey?:string;
}

const { TabPane } = Tabs;

class Config extends React.PureComponent<{},IConfigState>{
    constructor(props:{}){
        super(props);
        this.state={
            activeKey:"1"
        }
    }
    @Bind
    private onChange(activeKey:string){
        this.setState({
            activeKey
        })
    }
    render(){
        const {activeKey} = this.state;
        return (
          <div className="container">
              <Tabs className="tabs-margin-none" onChange={this.onChange} activeKey={activeKey} type="card" children={
                  [
                      <TabPane tab="pdd热销款采集" key="1"><HotGather/></TabPane>,
                      <TabPane tab="pdd/1688指定URL采集" key="2">Content of Tab Pane 1</TabPane>
                  ]
              }/>
          </div>
        )
    }
}

export default Config;
