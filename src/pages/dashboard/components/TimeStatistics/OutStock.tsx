import React, {
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef,
    forwardRef,
    ForwardRefRenderFunction,
    useImperativeHandle,
} from 'react';
import { DatePicker, Table } from 'antd';
import { getUTCDate, startDateToUnixWithUTC, endDateToUnixWithUTC } from '@/utils/date';
import { ECharts } from 'echarts';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import dayjs, { Dayjs } from 'dayjs';
import { JsonFormRef } from 'react-components/es/JsonForm';

import styles from '../../_timeStatistics.less';
import { ColumnsType } from 'antd/es/table';
import { getMonitorOrder } from '@/services/dashboard';
import { IMonitorOrderReq, IMonitorOrderItem } from '@/interface/IDashboard';

const { RangePicker } = DatePicker;

const timeFormat = 'YYYY-MM-DD';
const colors = ['#aaa', '#73A0FA', '#73DEB3', '#FFB761'];

export interface IOutStockRef {
    onSearch(): Promise<void>;
}

interface IOutStockProps {
    searchRef: React.RefObject<JsonFormRef>;
}

const OutStock: ForwardRefRenderFunction<IOutStockRef, IOutStockProps> = ({ searchRef }, ref) => {
    const chartRef = useRef<ECharts | null>(null);
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([
        getUTCDate().add(-10, 'day'),
        getUTCDate(),
    ]);

    const disabledDate = useCallback(currentDate => {
        return currentDate.valueOf() > getUTCDate().valueOf();
    }, []);

    const handleRangePicker = useCallback(values => {
        // console.log(values);
        setDates(values);
    }, []);

    const _getMonitorOrder = useCallback(
        async (params?: IMonitorOrderReq) => {
            const data = await searchRef.current?.getFieldsValue();
            console.log('_getMonitorOrder', data);
            const postData = {
                ...data,
                confirm_time_start: startDateToUnixWithUTC(dates[0]),
                confirm_time_end:
                    getUTCDate().format(timeFormat) === dates[1].format(timeFormat)
                        ? getUTCDate().unix()
                        : endDateToUnixWithUTC(dates[1]),

                ...(params || {}),
            };
            getMonitorOrder(postData).then(({ data }) => {
                const { confirm_time_start: startTime, confirm_time_end: endTime } = postData;
                // console.log('getMonitorOrder', data);
                renderChart(startTime, endTime, data);
            });
        },
        [dates],
    );

    const onSearch = useCallback(() => {
        console.log('出库搜索');
        _getMonitorOrder();
        return Promise.resolve();
        // return
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            onSearch: onSearch,
        }),
        [],
    );

    const getRangeFormatDate = useCallback((startTime, endTime) => {
        const endFormatDate = dayjs(endTime * 1000, { utc: true }).format(timeFormat);
        let currentFormatDate = dayjs(startTime * 1000, { utc: true }).format(timeFormat);
        let i = 1;
        const formatDateList = [currentFormatDate];

        while (formatDateList[formatDateList.length - 1] !== endFormatDate) {
            currentFormatDate = dayjs(startTime * 1000, { utc: true })
                .add(i, 'day')
                .format(timeFormat);
            formatDateList.push(currentFormatDate);
            i++;
        }

        return formatDateList;
        // console.log(111111, endFormatDate, formatDateList);
    }, []);

    const renderChart = useCallback((startTime, endTime, data) => {
        console.log('renderChart', startTime, endTime, data);
        const { lastUpdateTime, monitorOrder } = data;

        const formatDateList = getRangeFormatDate(startTime, endTime);

        const dayMap: { [key: string]: IMonitorOrderItem[] } = {};

        monitorOrder?.forEach((item: IMonitorOrderItem) => {
            const { dayNum } = item;
            !dayMap[dayNum] && (dayMap[dayNum] = []);
            dayMap[dayNum].push(item);
        });

        chartRef.current?.setOption({
            title: {
                text: '出库率',
                subtext: `（最近更新时间：${formatDateList}）`,
                left: 'center',
                bottom: 0,
            },
            tooltip: {
                trigger: 'axis',
                formatter: info => {
                    // console.log('formatter', info);
                    return `
                        <div style="padding: 8px 20px 8px 10px;">
                            <div style="margin-bottom: 4px;">
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: #6395FA; vertical-align: 2px;"></span>
                                总订单: 
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: #63DAAB; vertical-align: 2px;"></span>
                                已出库: 
                            </div>
                            <div>
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: red; vertical-align: 2px;"></span>
                                已取消: 
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span style="display: inline-block; width: 6px; height: 6px; margin-right: 4px; background: yellow; vertical-align: 2px;"></span>
                                出库率: 
                            </div>
                        </div>
                    `;
                },
            },
            legend: {
                data: ['1天', '2天', '3天', '4天', '5天'],
            },
            grid: {
                left: '4%',
                right: '8%',
                bottom: '10%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                name: '确认订单时间',
                boundaryGap: false,
                data: [
                    '2020/06/22',
                    '2020/06/23',
                    '2020/06/24',
                    '2020/06/25',
                    '2020/06/26',
                    '2020/06/27',
                    '2020/06/28',
                ],
            },
            yAxis: {
                type: 'value',
                name: '出库率（%）',
            },
            series: [
                {
                    name: '1天',
                    type: 'line',
                    data: [120, 132, 101, 134, 90, 230, 210],
                    lineStyle: {
                        color: colors[0],
                    },
                },
                {
                    name: '2天',
                    type: 'line',
                    data: [220, 182, 191, 234, 290, 330, 310],
                },
                {
                    name: '3天',
                    type: 'line',
                    data: [150, 232, 201, 154, 190, 330, 410],
                },
                {
                    name: '4天',
                    type: 'line',
                    data: [320, 332, 301, 334, 390, 330, 320],
                },
                {
                    name: '5天',
                    type: 'line',
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                },
            ],
        });
    }, []);

    useEffect(() => {
        !chartRef.current &&
            (chartRef.current = echarts.init(
                document.getElementById('out-stock') as HTMLDivElement,
            ));
        // if (loading) {
        //     chartRef.current.showLoading();
        // } else {
        //     chartRef.current.hideLoading();
        //     renderChart(orderInfo);
        // }
        // renderChart();
        _getMonitorOrder();
    }, []);

    const columns = useMemo<ColumnsType<object>>(() => {
        return [
            {
                title: '时间',
                dataIndex: 'label',
                align: 'center',
            },
            {
                title: '2020/06/22',
                dataIndex: '2020/06/22',
                align: 'center',
            },
            {
                title: '2020/06/23',
                dataIndex: '2020/06/23',
                align: 'center',
            },
            {
                title: '2020/06/24',
                dataIndex: '2020/06/24',
                align: 'center',
            },
            {
                title: '2020/06/25',
                dataIndex: '2020/06/25',
                align: 'center',
            },
            {
                title: '2020/06/26',
                dataIndex: '2020/06/26',
                align: 'center',
            },
            {
                title: '2020/06/27',
                dataIndex: '2020/06/27',
                align: 'center',
            },
            {
                title: '2020/06/28',
                dataIndex: '2020/06/28',
                align: 'center',
            },
        ];
    }, []);

    const dataSource = useMemo(() => {
        return [
            {
                label: '总订单',
                '2020/06/22': 100,
                '2020/06/23': 200,
                '2020/06/24': 300,
                '2020/06/25': 400,
                '2020/06/26': 500,
                '2020/06/27': 600,
                '2020/06/28': 700,
            },
            {
                label: '已出库',
                '2020/06/22': 100,
                '2020/06/23': 200,
                '2020/06/24': 300,
                '2020/06/25': 400,
                '2020/06/26': 500,
                '2020/06/27': 600,
                '2020/06/28': 700,
            },
            {
                label: '已取消',
                '2020/06/22': 100,
                '2020/06/23': 200,
                '2020/06/24': 300,
                '2020/06/25': 400,
                '2020/06/26': 500,
                '2020/06/27': 600,
                '2020/06/28': 700,
            },
            {
                label: '出库率',
                '2020/06/22': 100,
                '2020/06/23': 200,
                '2020/06/24': 300,
                '2020/06/25': 400,
                '2020/06/26': 500,
                '2020/06/27': 600,
                '2020/06/28': 700,
            },
        ];
    }, []);

    return useMemo(() => {
        return (
            <>
                <div className={styles.dateSection}>
                    <span className={styles.label}>日期：</span>
                    <RangePicker
                        allowClear={false}
                        value={dates}
                        disabledDate={disabledDate}
                        onChange={handleRangePicker}
                    />
                </div>
                <div id="out-stock" className={styles.chartSection}></div>
                <Table bordered columns={columns} dataSource={dataSource} pagination={false} />
            </>
        );
    }, [columns]);
};

export default forwardRef(OutStock);
