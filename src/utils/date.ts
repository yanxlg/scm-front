import dayjs, { Dayjs } from 'dayjs';

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
