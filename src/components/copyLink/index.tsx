import React, { useCallback, useState } from 'react';
import styles from './_index.less';
import { Popover } from 'antd';
import { Icons } from '@/components/Icon';
import { CheckCircleTwoTone } from '@ant-design/icons';

const CopyLink: React.FC = props => {
    const [copied, setCopied] = useState(false);
    const onClick = useCallback(() => {
        if (copied) return;
        setCopied(true);

        let copyInput = document.createElement('input');
        copyInput.value = window.location.href;
        document.body.appendChild(copyInput);
        copyInput.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
        document.body.removeChild(copyInput);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }, [copied]);
    return (
        <div className={styles.fixedWidgets}>
            <Popover
                placement="left"
                content={<span className={styles.copyTip}>copy success!</span>}
                title={null}
                visible={copied}
            >
                <div className={styles.copyIcon} onClick={onClick}>
                    {copied ? (
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                    ) : (
                        <Icons type="scm-copy" />
                    )}
                </div>
            </Popover>
        </div>
    );
};

export default CopyLink;
