import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { Bind } from 'lodash-decorators';
import router from 'umi/router';

export declare interface PropertyItem {
    property: string;
    count: number;
}

declare interface DSUProps {
    propertyList: PropertyItem[];
}


export default class DataStatusUpdate extends PureComponent<DSUProps> {
    @Bind
    private goTo() {
        // 跳转到详情
        router.push(`${window.location.pathname}/version`);
    }

    render() {
        const { propertyList } = this.props;
        return (
            <Card id="vova-goods-card" title={<span className="ant-form-item">数据/状态更新</span>} onClick={this.goTo}>
                <ul className="dataUpdateTags">
                    {
                        propertyList.map((item: PropertyItem, index) => {
                            return <li key={item.property + index}>
                                {item.property}
                                (<span>{item.count}</span>)
                            </li>;
                        })
                    }
                </ul>
            </Card>
        );
    }
}
