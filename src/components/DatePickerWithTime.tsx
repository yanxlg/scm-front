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

    private getCurrentHour(){

    }

    private getCurrentMinute(){

    }

    private getCurrentSecond(){

    }

    @Bind
    private onOpenChange(open:boolean){
        alert("111");
        if(open){
            const {minTime,maxTime} = this.props;
            const minHour = minTime?.hour()??0;
            const maxHour = maxTime?.hour()??23;
            const now = moment();

            const hour = this.state.hour||now.hour();
            const minute = this.state.minute||now.minute();
            const second = this.state.second||now.second();


            return {
                hourRange:range(0,minHour).concat(range(maxHour,23)),
            }
        }
    }
    @Bind
    private onPanelChange(value:Moment|null,mode: DatePickerMode){
        if(mode === "time"){
            const {value} = this.props;
            const defaultOpenValue = moment();
            const currentValue = value||defaultOpenValue;
            const hour = currentValue.hour();
            const minute = currentValue.minute();
            const second = currentValue.second();
            const {minTime,maxTime} = this.props;
            const minHour = minTime?.hour()??0;
            const maxHour = maxTime?.hour()??23;
            this.setState({
                defaultOpenValue:defaultOpenValue,
                hourRange:range(0,Math.max(minHour,hour)).concat(range(maxHour,23)),
                // minuteRange:range()
            })
        }
    }

    @Bind
    private onChange(date: Moment|null, dateString: string){
        if(date){
            // console.log(date);
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
            }} disabledTime={(date)=>{
                return {
                    disabledHours:()=>hourRange,
                    disabledMinutes:()=>[],
                    disabledSeconds:()=>[],
                }
            }} onChange={this.onChange} onPanelChange={this.onPanelChange}/>
        )
    }
}

export {DatePickerWithTime};
