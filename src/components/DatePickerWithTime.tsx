import React from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { Bind } from 'lodash-decorators';
import { PickerProps } from 'antd/es/date-picker/generatePicker';

function range(start: number, end: number) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

declare interface IDatePickerWithTimeState {
    hourRange: number[];
    minuteRange: number[];
    secondRange: number[];
    hour?: number;
    minute?: number;
    second?: number;
    defaultOpenValue?: Moment;
}

type IDatePickerWithTimeProps = PickerProps<Moment> & {
    minTime?: Moment;
    maxTime?: Moment;
};

class DatePickerWithTime extends React.PureComponent<
    IDatePickerWithTimeProps,
    IDatePickerWithTimeState
> {
    constructor(props: IDatePickerWithTimeProps) {
        super(props);
        this.state = {
            hourRange: range(0, 23),
            minuteRange: range(0, 59),
        };
    }

    @Bind
    private onOpenChange(status: boolean) {
        if (status) {
            const { minTime, maxTime, value } = this.props;
            const current = moment();
            const minMoment = minTime ? (minTime.isAfter(current) ? minTime : current) : current;
            const maMoment = maxTime;
            if (value) {
                const diff = value.isAfter(minMoment, 'd')
                    ? 1
                    : value.isSame(minMoment, 'd')
                    ? 0
                    : -1;
                switch (diff) {
                    case -1:
                        this.setState({
                            hourRange: range(0, 24),
                            minuteRange: range(0, 60),
                        });
                        break;
                    case 0:
                        this.setState({
                            hourRange: range(0, minMoment.hour()),
                            minuteRange: range(0, minMoment.minute()),
                        });
                        break;
                    case 1:
                        this.setState({
                            hourRange: [],
                            minuteRange: [],
                        });
                        break;
                    default:
                        break;
                }
            } else {
                this.setState({
                    hourRange: range(0, current.hour()),
                    minuteRange: range(0, current.minute()),
                });
            }
        }
    }

    @Bind
    private onChange(date: Moment | null, dateString: string) {
        if (date) {
            const copy = date.clone();
            const hour = date.hour();
            const minute = date.minute();
            const { minTime, maxTime } = this.props;
            const { defaultOpenValue } = this.state;
            const minDate = minTime?.isAfter(defaultOpenValue) ? minTime : defaultOpenValue;
            const maxUnix = maxTime?.unix();
            const minUnix = minDate?.unix();
            const minHour = minUnix
                ? Math.max(
                      minUnix / 3600 -
                          copy
                              .hour(0)
                              .minute(0)
                              .second(0)
                              .unix() /
                              3600,
                      0,
                  ) - 1
                : 0;
            const maxHour = maxUnix
                ? Math.min(
                      maxUnix / 3600 -
                          copy
                              .hour(0)
                              .minute(0)
                              .second(0)
                              .unix() /
                              3600,
                      23,
                  )
                : 23;
            const maxMinute = maxUnix
                ? Math.min(
                      maxUnix / 60 -
                          copy
                              .hour(hour)
                              .minute(0)
                              .second(0)
                              .unix() /
                              60,
                      59,
                  )
                : 59;
            const maxSecond = maxUnix
                ? Math.min(
                      maxUnix -
                          copy
                              .hour(hour)
                              .minute(minute)
                              .second(0)
                              .unix(),
                      59,
                  )
                : 59;
            const minMinute = minUnix
                ? Math.max(
                      minUnix / 60 -
                          copy
                              .hour(hour)
                              .minute(0)
                              .second(0)
                              .unix() /
                              60,
                      0,
                  ) - 1
                : 0;
            const minSecond = minUnix
                ? Math.max(
                      minUnix -
                          copy
                              .hour(hour)
                              .minute(minute)
                              .second(0)
                              .unix(),
                      0,
                  )
                : 0;
            this.setState({
                hourRange: range(0, minHour).concat(range(maxHour, 23)),
                minuteRange: range(0, minMinute).concat(range(maxMinute, 59)),
                secondRange: range(0, minSecond).concat(range(maxSecond, 59)),
            });
        }
        const { onChange } = this.props;
        if (onChange) {
            onChange(date, dateString);
        }
    }

    render() {
        const { hourRange, minuteRange, secondRange } = this.state;
        const format = 'HH:mm';
        return (
            <DatePicker
                {...this.props}
                showTime={{ hideDisabledOptions: true, format: format }}
                disabledTime={date => {
                    return {
                        disabledHours: () => hourRange,
                        disabledMinutes: () => minuteRange,
                    };
                }}
                onChange={this.onChange}
                onOpenChange={this.onOpenChange}
            />
        );
    }
}

export { DatePickerWithTime };
