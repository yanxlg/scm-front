import React, { useMemo } from 'react';
import { Modal } from 'antd';
import { JsonForm } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';

declare interface CreatePurchaseProps {
    visible: string | false;
    onClose: () => void;
}

const CreatePurchase = () => {
    return useMemo(() => {
        return (
            <div>
                <JsonForm
                    enableCollapse={false}
                    layout={'horizontal'}
                    fieldList={[
                        {
                            type: 'layout',
                            className: formStyles.flexRow,
                            fieldList: [
                                {
                                    type: 'select',
                                    name: 'value1',
                                    label: '采购负责人',
                                    formItemClassName: classNames(
                                        formStyles.flexInline,
                                        formStyles.formItem,
                                    ),
                                    optionList: [
                                        {
                                            name: '',
                                            value: '',
                                        },
                                    ],
                                },
                                {
                                    type: 'layout',
                                    className: classNames(
                                        formStyles.flexInline,
                                        formStyles.flexColumn,
                                    ),
                                    style: { marginLeft: 200, textAlign: 'right' },
                                    fieldList: [
                                        {
                                            type: 'select',
                                            name: 'value2',
                                            label: '供应商渠道',
                                            optionList: [
                                                {
                                                    name: '',
                                                    value: '',
                                                },
                                            ],
                                        },
                                        {
                                            type: 'input',
                                            name: 'value3',
                                            label: '供应商名称',
                                        },
                                        {
                                            type: 'input',
                                            name: 'value4',
                                            label: '供应商订单ID',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'select',
                            name: 'value5',
                            label: '交付仓库',
                            optionList: [
                                {
                                    name: '',
                                    value: '',
                                },
                            ],
                        },
                        {
                            type: 'layout',
                            fieldList: [
                                {
                                    type: 'layout',
                                    className: formStyles.flexRow,
                                    fieldList: [
                                        {
                                            type: 'input',
                                            name: 'price',
                                            label: '单价(¥)',
                                        },
                                        {
                                            type: 'input',
                                            name: 'number',
                                            label: '采购数',
                                        },
                                    ],
                                },
                            ],
                            header: (
                                <React.Fragment>
                                    <hr />
                                    <div>采购商品详情</div>
                                </React.Fragment>
                            ),
                            footer: <div>总金额(¥)：¥0</div>,
                        },
                    ]}
                />
            </div>
        );
    }, []);
};

const CreatePurchaseModal = ({ visible, onClose }: CreatePurchaseProps) =>
    useMemo(
        () => (
            <Modal
                width={900}
                title="创建采购单"
                visible={!!visible}
                destroyOnClose={true}
                onCancel={onClose}
            >
                <CreatePurchase />
            </Modal>
        ),
        [visible],
    );

export default CreatePurchaseModal;
