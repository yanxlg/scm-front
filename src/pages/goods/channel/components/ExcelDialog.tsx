import React, { RefObject, useCallback, useMemo, useState } from 'react';
import { message, Modal, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { JsonFormRef } from 'react-components/es/JsonForm';
import { exportChannelProductList } from '@/services/channel';
import channelStyles from '@/styles/_channel.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

declare interface IExcelDialogProps {
    visible: boolean;
    total: number;
    onCancel: () => void;
    form: RefObject<JsonFormRef>;
}

const exportNum = 10000;

const ExcelDialog: React.FC<IExcelDialogProps> = ({ visible, onCancel, total, form }) => {
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleOk = useCallback(() => {
        setLoading(true);
        // export
        const values = form.current!.getFieldsValue();
        return exportChannelProductList({
            pageNumber: index + 1,
            pageSize: exportNum,
            ...values,
        })
            .catch(err => {
                message.error('导出表格失败！');
            })
            .finally(() => {
                onCancel();
            })
            .finally(() => {
                setLoading(false);
            });
    }, [index]);

    const onChange = useCallback((e: RadioChangeEvent) => {
        setIndex(e.target.value);
    }, []);

    const list = useMemo<number[]>(() => {
        let _list: number[] = [];
        for (let i = 0; i < Math.ceil(total / exportNum); i++) {
            _list.push(i);
        }
        return _list;
    }, [total]);

    return useMemo(() => {
        return (
            <Modal
                title="导出EXCEL"
                className={channelStyles.channelExportModal}
                visible={visible}
                onCancel={onCancel}
                onOk={handleOk}
                confirmLoading={loading}
            >
                <Radio.Group onChange={onChange} value={index}>
                    {list.map(index => {
                        let desc = '';
                        if (index === 0) {
                            desc = '导出前1万条';
                        } else if (index === list.length - 1) {
                            desc = `导出${index}万条-${total}条`;
                        } else {
                            desc = `导出${index}万条-${index + 1}条`;
                        }
                        return (
                            <Radio key={index} className={formStyles.formCheckbox} value={index}>
                                {desc}
                            </Radio>
                        );
                    })}
                </Radio.Group>
            </Modal>
        );
    }, [loading, index, total, visible]);
};

export default ExcelDialog;
