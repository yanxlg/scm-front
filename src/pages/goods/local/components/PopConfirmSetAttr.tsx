import React, { useMemo, useCallback } from 'react';
import { Popconfirm, Button } from 'antd';

import './PopConfirmSetAttr.less';
import { CheckOutlined } from '@ant-design/icons';

declare interface IProps {
    text: string;
}

const SetAttr: React.FC<IProps> = ({text}) => {

    const confirm = useCallback(() => {
        console.log(1111);
    }, [])

    const attrTag = useMemo(() => {
        return (
            <div className="select-attr">
                {
                    ['品牌', '大件', '违禁品', '重件'].map((item, index) => (
                        <Button

                            size="small"
                            ghost={index%2 === 0 ? false : true}
                            type={ index%2 === 0 ? 'default' : 'primary' }
                            className={['btn'].join(' ')}
                            key={item}
                        >
                            {item}
                            <div className="bg"></div>
                            <div className="tick"></div>
                        </Button>
                    ))
                }
            </div>
        )
    }, [])

    return useMemo(() => {
        return (
            <Popconfirm
                placement="bottom"
                okText="确定"
                cancelText="取消"
                icon={null}
                title={attrTag}
                onConfirm={confirm}
            >
                <Button
                    type="link"
                >
                    编辑
                    
                </Button>
            </Popconfirm>
        )
    }, [attrTag])
}

export default SetAttr;