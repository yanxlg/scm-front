import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Form, Checkbox, InputNumber, Input, Cascader } from 'antd';

import styles from '../_abnormal.less';

const options = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [
            {
              value: 'xihu',
              label: 'West Lake',
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
            },
          ],
        },
      ],
    },
];

interface IProps {
    visible: boolean;
    onCancel(): void;
}

const AbnormalModal: React.FC<IProps> = ({
    visible,
    onCancel
}) => {
    const [form] = Form.useForm();

    const handleOk = useCallback(
        () => {
            
        },
        [],
    );

    const handleCancel = useCallback(
        () => {
            onCancel();
        },
        [],
    );

    const handleCheckboxChange = useCallback(
        (vals) => {
            console.log('val', vals);
        },
        []
    );

    return useMemo(() => {
        return (
            <Modal
                title="异常处理"
                width={720}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} className={styles.abnormalModal}>
                    <div className={styles.title}>请选择需要的操作</div>
                    <Checkbox.Group onChange={handleCheckboxChange}>
                        <Checkbox value="A" className={styles.checkbox}>退款</Checkbox>
                        <Checkbox value="B" className={styles.checkbox}>拒收</Checkbox>
                        <Checkbox value="C" className={styles.checkbox}>补发</Checkbox>
                    </Checkbox.Group>

                    <div className={styles.sectionBox}>
                        <Form.Item className={styles.itemBox} label={<span className={styles.label}>拒收数量</span>}>
                            <InputNumber className={styles.inputNumber} placeholder="请输入数量" />
                        </Form.Item>
                        <Form.Item className={styles.itemBox} label={<span className={styles.label}>收货人</span>}>
                            <Input placeholder="请输入收货人姓名" />
                        </Form.Item>
                        <Form.Item className={styles.itemBox} label={<span className={styles.label}>手机号</span>}>
                            <Input placeholder="请输入手机号" />
                        </Form.Item>
                        <Form.Item className={styles.cascaderBox} label={<span className={styles.label}>地址信息</span>}>
                            <Cascader
                                placeholder="请选择省/市/区/街道"
                                options={options}
                            />
                        </Form.Item>
                        <Form.Item label={<span className={styles.label}>详细地址</span>}>
                            <Input.TextArea placeholder="请输入详细的地址信息，如道路、门牌号、小区、楼栋号、单元等信息" />
                        </Form.Item>
                        <Form.Item className={styles.itemBox} label={<span className={styles.label}>邮政编码</span>}>
                            <Input placeholder="填写编码" />
                        </Form.Item>
                    </div>
                    <div className={styles.sectionBox}>
                        <Form.Item className={styles.itemBox} label={<span className={styles.label}>运单号</span>}>
                            <Input className={styles.inputNumber} placeholder="关联运单号" />
                        </Form.Item>
                        <Form.Item className={styles.itemBox} label={<span className={styles.label}>入库数量</span>}>
                            <InputNumber className={styles.inputNumber} placeholder="请输入数量" />
                        </Form.Item>
                    </div>
                    <div className={styles.remark}>
                        <Form.Item label={<span className={styles.label}>备注</span>}>
                            <Input.TextArea placeholder="原因" />
                        </Form.Item>
                    </div>
                    
                </Form>
            </Modal>
        )
    }, [visible])
}

export default AbnormalModal;