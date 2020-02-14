import React, { PureComponent } from 'react'
import { Card} from 'antd';


export declare interface PropertyItem {
    property: string;
    count: number;
}

declare interface DSUProps {
    propertyList: PropertyItem[];
}

// const goodsProps = ['价格', '运费', 'SKU数量', '商品标题', '商品描述', '类目', '规格', '下架', '上架', 'SKU对应图片']

export default class DataStatusUpdate extends PureComponent<DSUProps> {
    render() {
        const { propertyList } = this.props;
        return (
            <Card id="vova-goods-card" title={<span className="ant-form-item">数据/状态更新</span>} onClick={this.goTo}>
                <ul className="dataUpdateTags">
                    {
                        propertyList.map((item: PropertyItem, index) => {
                            return <li key={item.property+index}>
                                {item.property}
                                (<span>{item.count}</span>)
                            </li>
                        })
                    }
                </ul>
            </Card>
        )
    }
}
