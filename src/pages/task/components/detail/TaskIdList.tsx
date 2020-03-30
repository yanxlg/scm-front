import React, { useCallback, useMemo, useState } from 'react';
import { Row, Col, Checkbox, List, Button } from 'antd';
import { AutoSizer, List as VList } from 'react-virtualized';
import { ISubTaskIdItem } from '@/interface/ITask';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import taskStyles from '@/styles/_task.less';
import styles from '@/styles/_index.less';
import btnStyles from '@/styles/_btn.less';
import classNames from 'classnames';

declare interface TaskIdListProps {
    dataSet: ISubTaskIdItem[];
    onSubmit: (taskIds: string[]) => void;
    onCancel: () => void;
    checkedIds: string[];
}

const rowColumns = 4;

const TaskIdList: React.FC<TaskIdListProps> = ({
    dataSet,
    onSubmit,
    onCancel,
    checkedIds: proIds,
}) => {
    const [checkedIds, setCheckedIds] = useState<string[]>(proIds);

    const renderItem = useCallback(
        ({ index, key, style }) => {
            let columns = [];
            for (let i = 0; i < rowColumns; i++) {
                const item = dataSet[index * rowColumns + i];
                if (item) {
                    const id = item.plan_id;
                    columns.push(
                        <Col key={`${key}_${i}`} span={24 / rowColumns}>
                            <Checkbox
                                value={id}
                                checked={checkedIds && checkedIds.indexOf(id) > -1}
                                onChange={checkedStateChange}
                                className={item.status === 3 ? taskStyles.errorText : undefined}
                            >
                                {id}
                            </Checkbox>
                        </Col>,
                    );
                }
            }
            return (
                <Row style={style} align="middle">
                    {columns}
                </Row>
            );
        },
        [dataSet, checkedIds],
    );

    const onCheckedAllStateChange = useCallback(
        (e: CheckboxChangeEvent) => {
            const checked = e.target.checked;
            if (checked) {
                setCheckedIds(dataSet.map(data => data.plan_id));
            } else {
                setCheckedIds([]);
            }
        },
        [dataSet],
    );

    const checkedStateChange = useCallback(
        (e: CheckboxChangeEvent) => {
            const { checked, value } = e.target;
            const set = new Set(checkedIds);
            checked ? set.add(value) : set.delete(value);
            setCheckedIds(Array.from(set));
        },
        [checkedIds, dataSet],
    );

    const submit = useCallback(() => {
        onSubmit(checkedIds);
    }, [checkedIds]);

    const cancel = useCallback(() => {
        onCancel();
    }, []);

    const footer = useMemo(() => {
        return (
            <div className={classNames(styles.textRight, btnStyles.btnGroup)}>
                <Button onClick={cancel}>取消</Button>
                <Button onClick={submit} type="primary">
                    确定
                </Button>
            </div>
        );
    }, [checkedIds]);

    return useMemo(() => {
        const size = dataSet.length;
        const rowCount = Math.ceil(size / rowColumns);
        const checkedLength = checkedIds?.length;
        const checkedAll = checkedIds?.length === size;
        const indeterminate = checkedLength > 0 && !checkedAll;
        return (
            <div style={{ height: 200 }}>
                <Row align="middle" style={{ height: 40 }}>
                    <Col>
                        <Checkbox
                            checked={checkedAll}
                            onChange={onCheckedAllStateChange}
                            indeterminate={indeterminate}
                        >
                            全部子任务
                        </Checkbox>
                    </Col>
                </Row>
                {size > 0 && (
                    <List footer={footer}>
                        <AutoSizer disableHeight={true}>
                            {({ width }) => (
                                <VList
                                    overscanRowCount={8}
                                    tabIndex={null}
                                    height={120}
                                    rowCount={rowCount}
                                    rowHeight={40}
                                    rowRenderer={renderItem}
                                    width={width}
                                />
                            )}
                        </AutoSizer>
                    </List>
                )}
            </div>
        );
    }, [dataSet, checkedIds]);
};

export default TaskIdList;
