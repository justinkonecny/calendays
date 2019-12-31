import React, {Component} from 'react';
import '../../css/common/Dropdown.scss';
import {TimeOfDay} from '../main/Constants';

class DropdownTime extends Component {
    constructor(props) {
        super(props);
        this.setTime = this.props.setTime;
        this.timesHours = [];
        this.timesMinutes = [];
        this.timesOfDay = [];
        this.state = {
            displayTime: this.props.startTime,
            showHourPicker: false,
            showMinutePicker: false,
            showTimeOfDayPicker: false
        };

        this.clickHourPicker = this.clickHourPicker.bind(this);
        this.clickMinutePicker = this.clickMinutePicker.bind(this);
        this.clickTimeOfDayPicker = this.clickTimeOfDayPicker.bind(this);
        this.selectHourFromMenu = this.selectHourFromMenu.bind(this);
        this.selectMinuteFromMenu = this.selectMinuteFromMenu.bind(this);
        this.selectTimeOfDayFromMenu = this.selectTimeOfDayFromMenu.bind(this);

        this.btnHours = [];
        this.btnMinutes = [];
        this.btnTimesOfDay = [];

        for (let i = 1; i < 13; i++) {
            const min = (i - 1) * 5;
            this.timesHours.push(i);
            this.timesMinutes.push(min);

            this.btnHours.push(this.getPickerOptionsHtml(i.toString().padStart(2, '0'), this.selectHourFromMenu));
            this.btnMinutes.push(this.getPickerOptionsHtml(min.toString().padStart(2, '0'), this.selectMinuteFromMenu));
        }

        for (const tod in TimeOfDay) {
            this.timesOfDay.push(tod);
            this.btnTimesOfDay.push(this.getPickerOptionsHtml(tod.toString().padStart(2, '0'), this.selectTimeOfDayFromMenu));
        }
    }

    clickHourPicker() {
        const showing = this.state.showHourPicker;
        this.setState({
            showHourPicker: !showing,
            showMinutePicker: false,
            showTimeOfDayPicker: false
        });
    }

    clickMinutePicker() {
        const showing = this.state.showMinutePicker;
        this.setState({
            showHourPicker: false,
            showMinutePicker: !showing,
            showTimeOfDayPicker: false
        });
    }

    clickTimeOfDayPicker() {
        const showing = this.state.showTimeOfDayPicker;
        this.setState({
            showHourPicker: false,
            showMinutePicker: false,
            showTimeOfDayPicker: !showing
        });
    }

    selectHourFromMenu(event) {
        const displayTime = [
            parseInt(event.target.innerText),
            this.state.displayTime[1],
            this.state.displayTime[2]
        ];
        this.setState({
            displayTime,
            showHourPicker: false
        });
        this.setTime(displayTime);
    }

    selectMinuteFromMenu(event) {
        const displayTime = [
            this.state.displayTime[0],
            parseInt(event.target.innerText),
            this.state.displayTime[2]
        ];
        this.setState({
            displayTime,
            showMinutePicker: false
        });
        this.setTime(displayTime);
    }

    selectTimeOfDayFromMenu(event) {
        const displayTime = [
            this.state.displayTime[0],
            this.state.displayTime[1],
            event.target.innerText
        ];
        this.setState({
            displayTime,
            showTimeOfDayPicker: false
        });
        this.setTime(displayTime);
    }

    getPickerContainer(onOpenCloseMenu, btnText, menuOptions, showPicker) {
        return (
            <div className={'date-time time-container'}>
                <button className={'btn-date-time btn-time'} onClick={onOpenCloseMenu}>
                    {btnText}
                </button>
                {showPicker && <div className={'picker picker-time'}>
                    {menuOptions}
                </div>}
            </div>
        );
    }

    getPickerOptionsHtml(text, onClickOption) {
        return (
            <button className={'picker-inner'} onClick={onClickOption} key={text}>
                {text}
            </button>
        );
    }

    render() {
        return (
            <div className={'display-flex'}>
                {this.getPickerContainer(this.clickHourPicker, this.state.displayTime[0].toString().padStart(2, '0'), this.btnHours, this.state.showHourPicker)}
                {this.getPickerContainer(this.clickMinutePicker, this.state.displayTime[1].toString().padStart(2, '0'), this.btnMinutes, this.state.showMinutePicker)}
                {this.getPickerContainer(this.clickTimeOfDayPicker, this.state.displayTime[2], this.btnTimesOfDay, this.state.showTimeOfDayPicker)}
            </div>
        );
    }
}

export default DropdownTime;
