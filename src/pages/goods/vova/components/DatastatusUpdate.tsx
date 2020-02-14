import React, { PureComponent } from 'react'
import { Card } from 'antd';
import {Bind} from 'lodash-decorators';
import router from 'umi/router';

const goodsProps = ['价格', '运费', 'SKU数量', '商品标题', '商品描述', '类目', '规格', '下架', '上架', 'SKU对应图片']

export default class DatastatusUpdate extends PureComponent {
    @Bind
    private goTo(){
        // 跳转到详情
        router.push(`${window.location.pathname}/version`);
    }
    render() {
        return (
            <Card id="vova-goods-card" title={<span className="ant-form-item">数据/状态更新</span>} onClick={this.goTo}>
                <ul className="dataUpdateTags">
                    {
                        goodsProps.map((item: string, index) => {
                            return <li key={item+index}>
                                {item}
                                (<span>180</span>)
                            </li>
                        })
                    }
                </ul>
            </Card>
        )
    }
}
