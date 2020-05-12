import React, { useMemo, useState } from 'react';
import { Modal, Input, Table, Button, notification } from 'antd';

const { TextArea } = Input;

interface IProps {
    visible: boolean;
    productSn: string;
}

const GoodsMergeModal: React.FC<IProps> = ({
    visible,
    productSn
}) => {

    return useMemo(() => {
        const title = productSn ? `商品组 Product SN: ${productSn}` : '商品组';
        return <div>1111</div>
        return (
            <Modal
                title={title}
                visible={visible}
                width={860}
                confirmLoading={loading}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                okButtonProps={{
                    disabled: !commodityIds || loading,
                }}
            >
                <div className="text-center">
                    {productSn ? (
                        <Table
                            bordered
                            rowKey="commodityId"
                            loading={loading}
                            columns={this.columns}
                            dataSource={goodsSnList}
                            scroll={{ y: 400 }}
                            pagination={false}
                            style={{ marginBottom: 20 }}
                        />
                    ) : null}
                    <TextArea
                        placeholder="输入commodity_id可关联更新商品，以'英文逗号'分割"
                        value={commodityIds}
                        onChange={this.handleChange}
                    />
                </div>
            </Modal>
        )
    }, [visible]);
}

export default GoodsMergeModal;