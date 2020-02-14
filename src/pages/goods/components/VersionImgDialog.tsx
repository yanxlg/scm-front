import React from 'react';
import { Modal, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

declare interface VersionImgProps {
    visible: boolean;
    toggleVersionImgDialog(status: boolean): void;
}

declare interface IDataItem {
    [key: string]: string;
}

const imgList = [
    '//image-tb.airyclub.com/image/500_500/filler/26/61/6b075aafdcbf2c47ccc97ea3d5892661.jpg',
    '//image-tb.airyclub.com/image/500_500/filler/14/f8/16505aa7826f9765879f5d79b85814f8.jpg',
    '//image-tb.airyclub.com/image/500_500/filler/32/d6/6da124d68e4360b2b07b94e89bb932d6.jpg',
    '//image-tb.airyclub.com/image/500_500/filler/49/11/008d41366a61579120128f3dd2d14911.jpg',
    '//image-tb.airyclub.com/image/500_500/filler/cb/df/fb4fcb6545dfe9b4dcb01b6ef740cbdf.jpg'
]

class VersionImg extends React.PureComponent<VersionImgProps> {

    private columns: ColumnProps<IDataItem>[] = [
        {
            key: 'a1',
            width: 160,
            title: '商品版本号',
            dataIndex: 'a1',
            align: 'center',
        },
        {
            key: 'a2',
            width: 200,
            title: '主图',
            dataIndex: 'a2',
            align: 'center',
            className: 'top',
            render: (value: string, row: IDataItem, index: number) => {
                return (
                    <img className="main-img" src={value}/>
                )
            }
        },
        {
            key: 'a3',
            title: '副图',
            dataIndex: 'a3',
            align: 'center',
            className: 'top',
            render: (value: string[], row: IDataItem, index: number) => {
                return (
                    <div className="list">
                        {
                            value.map(item => (
                                <div className="item" key={item}>
                                    <img src={item}/>
                                    <div className="desc">sku id：888888</div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        }
    ]

    private handleCancel = () => {
        this.props.toggleVersionImgDialog(false);
    }

    render() {

        const { visible } = this.props;

        const dataSource: any = [
            {
                a1: 'T003',
                a2: imgList[0],
                a3: imgList
            }
        ]

        return (
            <Modal
                footer={null}
                width={900}
                visible={visible}
                onCancel={this.handleCancel}
            >
                <Table
                    bordered={true}
                    className="goods-version-dialog"
                    pagination={false}
                    columns={this.columns}
                    dataSource={dataSource}

                />
            </Modal>
        )
    }
}

export default VersionImg;
