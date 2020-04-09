import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { Button, Input } from 'antd';
import { deleteTag } from '@/services/goods-attr';
import { LoadingButton } from 'react-components';

import styles from '../_goodsAttr.less';

declare interface IProps {
    className?: string;
    text: string;
    getTagsList(): void;
    setLoading(status: boolean): void;
}

const EditTag: React.FC<IProps> = ({ className, text, getTagsList, setLoading }) => {
    const [editStatus, setEditStatus] = useState(false);
    const inputRef = useRef<Input>(null);

    const clickTag = useCallback(() => {
        setEditStatus(true);
    }, []);
    // const handleBlur = useCallback(() => {
    //     setEditStatus(false);
    // }, [])

    const _deleteTag = useCallback(() => {
        setLoading(true);
        return deleteTag(text).then(() => {
            getTagsList();
        });
    }, [text]);

    useEffect(() => {
        editStatus && inputRef.current?.focus();
    }, [editStatus]);

    return useMemo(() => {
        return (
            <div className={className}>
                {editStatus ? (
                    <div className={styles.editBox}>
                        <Input
                            ref={inputRef}
                            className={styles.input}
                            defaultValue={text}
                            // onBlur={handleBlur}
                            placeholder="请输入新标签"
                        />
                        {/* <Button size="small" type="primary" className={styles.btnUpdate}>
                            修改
                        </Button> */}
                        <Button size="small" className={styles.btnDel} onClick={_deleteTag}>
                            删除
                        </Button>
                    </div>
                ) : (
                    <Button onClick={clickTag}>{text}</Button>
                )}
            </div>
        );
    }, [editStatus, text]);
};

export default EditTag;
