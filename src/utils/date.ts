import dayjs, { Dayjs } from 'dayjs';

const timeFormat = 'YYYY-MM-DD';

export function getUTCDate() {
    // console.log(111111, new Date(dayjs().clone().hour(0).minute(0).second(0).valueOf()).toUTCString());
    // return dayjs(dayjs().clone().hour(0).minute(0).second(0).valueOf())
    return dayjs(new Date(), {
        utc: true,
    });
}

export function startDateToUnixWithUTC(utcDate: Dayjs) {
    return utcDate
        .clone()
        .hour(0)
        .minute(0)
        .second(0)
        .unix();
}

export function endDateToUnixWithUTC(utcDate: Dayjs) {
    return utcDate
        .clone()
        .hour(23)
        .minute(59)
        .second(59)
        .unix();
}

export function getRangeFormatDate(startTime: number, endTime: number) {
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
}
