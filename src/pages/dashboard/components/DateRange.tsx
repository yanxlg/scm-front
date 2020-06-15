import React, { useMemo, useCallback, useState } from 'react';
import { Button, DatePicker, Radio } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { getUTCDate, startDateToUnixWithUTC, endDateToUnixWithUTC } from '@/utils/date';

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
        const [startDate, endDate] = dates;
        const todayStr = getUTCDate().format(timeFormat);
        const startDateStr = startDate.format(timeFormat);
        const endDateStr = endDate.format(timeFormat);
        return endDateStr === todayStr && startDateStr === todayStr;
    }, [dates]);
    const isYesterday = useMemo(() => {
        const [startDate, endDate] = dates;
        const yesterdayStr = getUTCDate()
            .add(-1, 'day')
            .format(timeFormat);
        const startDateStr = startDate.format(timeFormat);
        const endDateStr = endDate.format(timeFormat);
        return endDateStr === yesterdayStr && startDateStr === yesterdayStr;
    }, [dates]);
    const isThreeToday = useMemo(() => {
        const [startDate, endDate] = dates;
        const yesterdayStr = getUTCDate()
            .add(-1, 'day')
            .format(timeFormat);
        const threeDayStr = getUTCDate()
            .add(-3, 'day')
            .format(timeFormat);
        const startDateStr = startDate.format(timeFormat);
        const endDateStr = endDate.format(timeFormat);
        return startDateStr === threeDayStr && endDateStr === yesterdayStr;
    }, [dates]);
    const isSevenToday = useMemo(() => {
        const [startDate, endDate] = dates;
        const yesterdayStr = getUTCDate()
            .add(-1, 'day')
            .format(timeFormat);
        const sevenDayStr = getUTCDate()
            .add(-7, 'day')
            .format(timeFormat);
        const startDateStr = startDate.format(timeFormat);
        const endDateStr = endDate.format(timeFormat);
        return startDateStr === sevenDayStr && endDateStr === yesterdayStr;
    }, [dates]);

    const disabledDate = useCallback(currentDate => {
        return currentDate.valueOf() > getUTCDate().valueOf();
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
            const today = getUTCDate();
            setDates([today, today]);
        }
    }, [isToday, setDates]);

    const handleYesterday = useCallback(() => {
        if (!isYesterday) {
            const yesterday = getUTCDate().add(-1, 'day');
            setDates([yesterday, yesterday]);
        }
    }, [isYesterday, setDates]);

    const handleThreeDay = useCallback(() => {
        if (!isThreeToday) {
            setDates([getUTCDate().add(-3, 'day'), getUTCDate().add(-1, 'day')]);
        }
    }, [isThreeToday, setDates]);

    const handleSevenDay = useCallback(() => {
        if (!isSevenToday) {
            setDates([getUTCDate().add(-7, 'day'), getUTCDate().add(-1, 'day')]);
        }
    }, [isSevenToday, setDates]);

    return useMemo(() => {
        return (
            <div>
                日期：
                <Button
                    ghost={isToday}
                    className={btnStyles.btnGutter}
                    type={isToday ? 'primary' : 'default'}
                    onClick={handleToday}
                >
                    今日
                </Button>
                <Button
                    ghost={isYesterday}
                    className={btnStyles.btnGutter}
                    type={isYesterday ? 'primary' : 'default'}
                    onClick={handleYesterday}
                >
                    昨日
                </Button>
                <Button
                    ghost={isThreeToday}
                    className={btnStyles.btnGutter}
                    type={isThreeToday ? 'primary' : 'default'}
                    onClick={handleThreeDay}
                >
                    近三日
                </Button>
                <Button
                    ghost={isSevenToday}
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
