import React from "react";
import { createPortal } from 'react-dom';
import { TaskType } from '@/enums/ConfigEnum';
import { DatePicker } from 'antd';
import moment, { Moment, MomentLongDateFormat } from 'moment';
import { DatePickerProps } from 'antd/es/date-picker/interface';
import {Bind} from 'lodash-decorators';
import { DatePickerMode } from 'antd/lib/date-picker/interface';


function range(start:number, end:number) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}


function disabledDateTime() {
    return {
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
    };
}


declare interface IDatePickerWithTimeState {
    hourRange:number[];
    minuteRange:number[];
    secondRange:number[];
    hour?:number;
    minute?:number;
    second?:number;
    defaultOpenValue?:Moment;
}

declare interface IDatePickerWithTimeProps extends DatePickerProps{
    minTime?:Moment;
    maxTime?:Moment;
}

class DatePickerWithTime extends React.PureComponent<IDatePickerWithTimeProps,IDatePickerWithTimeState>{
    constructor(props:IDatePickerWithTimeProps) {
        super(props);
        this.state={
            hourRange:range(0,23),
            minuteRange:range(0,59),
            secondRange:range(0,59)
        }
    }

    @Bind
    private onPanelChange(value:Moment|null,mode: DatePickerMode){
        if(mode === "time"){
            const {value} = this.props;
            const defaultOpenValue = moment();
            const currentValue = value||defaultOpenValue;
            const copy = defaultOpenValue.clone();
            const hour = currentValue.hour();
            const minute = currentValue.minute();
            const {minTime,maxTime} = this.props;

            const minDate = minTime?.isAfter(copy)?minTime:copy;

            const maxUnix = maxTime?.unix();

            const minUnix = minDate?.unix();

            const minHour = minUnix?Math.max(minUnix/3600 - copy.hour(0).minute(0).second(0).unix()/3600,0)-1:0;
            const maxHour = maxUnix?Math.min(maxUnix/3600 - copy.hour(0).minute(0).second(0).unix()/3600,23):23;
            const maxMinute = maxUnix?Math.min(maxUnix/60 - copy.hour(hour).minute(0).second(0).unix()/60,59):59;
            const maxSecond = maxUnix?Math.min(maxUnix - copy.hour(hour).minute(minute).second(0).unix(),59):59;

            const minMinute = minUnix?Math.max(minUnix/60 - copy.hour(hour).minute(0).second(0).unix()/60,0)-1:0;
            const minSecond = minUnix?Math.max(minUnix - copy.hour(hour).minute(minute).second(0).unix(),0):0;

            this.setState({
                defaultOpenValue:defaultOpenValue,
                hourRange:range(0,Math.max(minHour,hour)).concat(range(maxHour,23)),
                minuteRange:range(0,minMinute).concat(range(maxMinute,59)),
                secondRange:range(0,minSecond).concat(range(maxSecond,59))
            })
        }
    }

    @Bind
    private onChange(date: Moment|null, dateString: string){
        if(date){
            const copy = date.clone();
            const hour = date.hour();
            const minute = date.minute();
            const {minTime,maxTime} = this.props;
            const {defaultOpenValue} = this.state;
            const minDate = minTime?.isAfter(defaultOpenValue)?minTime:defaultOpenValue;
            const maxUnix = maxTime?.unix();
            const minUnix = minDate?.unix();
            const minHour = minUnix?Math.max(minUnix/3600 - copy.hour(0).minute(0).second(0).unix()/3600,0)-1:0;
            const maxHour = maxUnix?Math.min(maxUnix/3600 - copy.hour(0).minute(0).second(0).unix()/3600,23):23;
            const maxMinute = maxUnix?Math.min(maxUnix/60 - copy.hour(hour).minute(0).second(0).unix()/60,59):59;
            const maxSecond = maxUnix?Math.min(maxUnix - copy.hour(hour).minute(minute).second(0).unix(),59):59;
            const minMinute = minUnix?Math.max(minUnix/60 - copy.hour(hour).minute(0).second(0).unix()/60,0)-1:0;
            const minSecond = minUnix?Math.max(minUnix - copy.hour(hour).minute(minute).second(0).unix(),0):0;
            this.setState({
                hourRange:range(0,minHour).concat(range(maxHour,23)),
                minuteRange:range(0,minMinute).concat(range(maxMinute,59)),
                secondRange:range(0,minSecond).concat(range(maxSecond,59))
            })
        }
        const { onChange } = this.props;
        if (onChange) {
            onChange(date, dateString);
        }
    }

    render() {
        const {hourRange,minuteRange,secondRange,defaultOpenValue} = this.state;

        return (
            <DatePicker {...this.props} showTime={{
                defaultOpenValue:defaultOpenValue,
                hideDisabledOptions:true
            }} disabledTime={(date)=>{
                return {
                    disabledHours:()=>hourRange,
                    disabledMinutes:()=>minuteRange,
                    disabledSeconds:()=>secondRange,
                }
            }} onChange={this.onChange} onPanelChange={this.onPanelChange}/>
        )
    }
}

export {DatePickerWithTime};
