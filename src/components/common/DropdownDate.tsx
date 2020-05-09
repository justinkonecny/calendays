import React, {Component} from 'react';
import '../../css/common/Dropdown.scss';
import {MonthNames, WeekDayNames} from "../main/Constants";

interface DropdownDateProps {
    monthLengths: number[];
    startDate: Date;
    setDate: (date: Date) => void;
    length: number;
}

interface DropdownDateState {
    showPicker: boolean;
}

export class DropdownDate extends Component<DropdownDateProps, DropdownDateState> {
    private dates: Date[];
    private displayDate: Date;

    constructor(props: DropdownDateProps) {
        super(props);
        this.dates = [];
        this.displayDate = this.props.startDate;
        
        this.state = {
            showPicker: false
        };

        this.clickEventDate = this.clickEventDate.bind(this);
        this.clickDate = this.clickDate.bind(this);

        const firstDate = this.props.startDate.getDate();
        for (let i = 0; i < this.props.length; i++) {
            const newDate = new Date(this.props.startDate);
            newDate.setDate(firstDate + i);
            this.dates.push(newDate);
        }
    }

    clickEventDate() {
        const showing = this.state.showPicker;
        this.setState({showPicker: !showing});
    }

    clickDate(event: any) {
        const fullDate = event.target.innerText;
        const split = fullDate.indexOf(' ') + 1; // Get index to separate weekday from date
        const dateStr = fullDate.substring(split); // Get the date without the weekday
        const date = new Date(dateStr);

        this.setState({showPicker: false});
        this.displayDate = date;
        this.props.setDate(date);
    }

    render() {
        return (
            <div className={'date-time display-container'}>
                <button className={'btn-date-time'} onClick={this.clickEventDate}>
                    {WeekDayNames[this.displayDate.getDay()][1]}. {MonthNames[this.displayDate.getMonth()]} {this.displayDate.getDate()} {this.displayDate.getFullYear()}
                </button>
                {this.state.showPicker && <div className={'picker'}>
                    {this.dates.map(date => {
                        return (
                            <button className={'picker-inner'} onClick={this.clickDate} key={date.toString()}>
                                {WeekDayNames[date.getDay()][1]}. {MonthNames[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear()}
                            </button>
                        );
                    })}
                </div>}
            </div>
        );
    }
}
