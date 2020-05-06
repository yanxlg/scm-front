import React, { useMemo, useCallback, useState } from 'react';
import { Button, DatePicker, Radio } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

// import styles from '../_order.less';
import btnStyles from '@/styles/_btn.less';

const { RangePicker } = DatePicker;
const timeFormat = 'YYYY-MM-DD';

interface IProps {
    dates: [Dayjs, Dayjs];
    setDates(dates: [Dayjs, Dayjs]): void;
}

const DateRange: React.FC<IProps> = ({ dates, setDates }) => {
    const isToday = useMemo(() => {
        // console.log('isToday', dates);
        const [startDate, endDate] = dates;
        const todayStr = dayjs().format(timeFormat);
        const startDateStr = startDate.format(timeFormat);
        const endDateStr = endDate.format(timeFormat);
        return endDateStr === todayStr && startDateStr === todayStr;
    }, [dates]);
    const isYesterday = useMemo(() => {
        const [startDate, endDate] = dates;
        const yesterdayStr = dayjs()
            .add(-1, 'day')
            .format(timeFormat);
        const startDateStr = startDate.format(timeFormat);
        const endDateStr = endDate.format(timeFormat);
        return endDateStr === yesterdayStr && startDateStr === yesterdayStr;
    }, [dates]);
    const isThreeToday = useMemo(() => {
        const [startDate, endDate] = dates;
        const yesterdayStr = dayjs()
            .add(-1, 'day')
            .format(timeFormat);
        const threeDayStr = dayjs()
            .add(-3, 'day')
            .format(timeFormat);
        const startDateStr = startDate.format(timeFormat);
        const endDateStr = endDate.format(timeFormat);
        return startDateStr === threeDayStr && endDateStr === yesterdayStr;
    }, [dates]);
    const isSevenToday = useMemo(() => {
        const [startDate, endDate] = dates;
        const yesterdayStr = dayjs()
            .add(-1, 'day')
            .format(timeFormat);
        const sevenDayStr = dayjs()
            .add(-7, 'day')
            .format(timeFormat);
        const startDateStr = startDate.format(timeFormat);
        const endDateStr = endDate.format(timeFormat);
        return startDateStr === sevenDayStr && endDateStr === yesterdayStr;
    }, [dates]);

    const disabledDate = useCallback(currentDate => {
        return currentDate.valueOf() > dayjs().valueOf();
    }, []);

    const handleRangePicker = useCallback(
        values => {
            // console.log(args);
            setDates(values);
        },
        [setDates],
    );

    const handleToday = useCallback(() => {
        if (!isToday) {
            // console.log('handleToday');
            const today = dayjs();
            setDates([today, today]);
        }
    }, [isToday, setDates]);

    const handleYesterday = useCallback(() => {
        if (!isYesterday) {
            // console.log('handleYesterday');
            const yesterday = dayjs().add(-1, 'day');
            setDates([yesterday, yesterday]);
        }
    }, [isYesterday, setDates]);

    const handleThreeDay = useCallback(() => {
        if (!isThreeToday) {
            // console.log('handleThreeDay');
            // const threeDay = dayjs().add(-3, 'day');
            setDates([dayjs().add(-3, 'day'), dayjs().add(-1, 'day')]);
        }
    }, [isThreeToday, setDates]);

    const handleSevenDay = useCallback(() => {
        if (!isSevenToday) {
            // console.log('handleSevenDay');
            // const sevenDay = dayjs().add(-7, 'day');
            setDates([dayjs().add(-7, 'day'), dayjs().add(-1, 'day')]);
        }
    }, [isSevenToday, setDates]);

    return useMemo(() => {
        return (
            <div>
                日期：
                <Button
                    className={btnStyles.btnGutter}
                    type={isToday ? 'primary' : 'default'}
                    onClick={handleToday}
                >
                    今日
                </Button>
                <Button
                    className={btnStyles.btnGutter}
                    type={isYesterday ? 'primary' : 'default'}
                    onClick={handleYesterday}
                >
                    昨日
                </Button>
                <Button
                    className={btnStyles.btnGutter}
                    type={isThreeToday ? 'primary' : 'default'}
                    onClick={handleThreeDay}
                >
                    近三日
                </Button>
                <Button
                    className={btnStyles.btnGutter}
                    type={isSevenToday ? 'primary' : 'default'}
                    onClick={handleSevenDay}
                >
                    近七日
                </Button>
                <RangePicker
                    allowClear={false}
                    value={dates}
                    disabledDate={disabledDate}
                    onChange={handleRangePicker}
                />
            </div>
        );
    }, [dates, setDates]);
};

export default DateRange;
