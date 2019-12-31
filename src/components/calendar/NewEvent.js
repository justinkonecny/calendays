import React, {Component} from 'react';
import '../../css/calendar/NewEvent.scss';
import {MonthNames, TimeOfDay, WeekDayNames} from '../main/Constants';
import {DbConstants} from '../../data/DbConstants';
import InputField from "../common/InputField";

class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.date = new Date();
        this.months = MonthNames;
        this.monthLengths = this.props.monthLengths;
        this.weekDays = WeekDayNames;
        this.state = {
            eventName: '',
            eventDateMonth: this.date.getMonth(),
            eventDate: this.date.getDate(),
            eventDateYear: this.date.getFullYear(),
            eventDateWeekDay: this.date.getDay(),
            eventStartTime: [5, 0, TimeOfDay.PM],
            eventEndTime: [8, 0, TimeOfDay.PM],
            eventLocation: '',
            eventMessage: 'Hey! Are you free for [title] on [date] from [start] to [end] at [location]?'
        };

        this.handleChange = this.handleChange.bind(this);
        this.populateEventParameters = this.populateEventParameters.bind(this);
        this.submitEvent = this.submitEvent.bind(this);
        this.parseDateTime = this.parseDateTime.bind(this);
        this.clickEventDate = this.clickEventDate.bind(this);
        this.setEventDate = this.setEventDate.bind(this);
        this.setEventStartTime = this.setEventStartTime.bind(this);
        this.setEventEndTime = this.setEventEndTime.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    populateEventParameters() {
        let newMessage = this.state.eventMessage;

        if (this.state.eventName !== '' && newMessage.includes('[title]')) {
            newMessage = newMessage.replace('[title]', this.state.eventName);
        }

        if (this.state.eventDateMonth !== null && this.state.eventDate !== null && this.state.eventDateYear !== null && newMessage.includes('[date]')) {
            const date = (this.state.eventDateMonth + 1) + '/' + this.state.eventDate + '/' + this.state.eventDateYear;
            newMessage = newMessage.replace('[date]', date);
        }

        if (this.state.eventStartTime !== null && this.state.eventStartTime.length === 3 && newMessage.includes('[start]')) {
            const start = this.state.eventStartTime[0] + ':' + this.state.eventStartTime[1].toString().padStart(2, '0') + ' ' + this.state.eventStartTime[2];
            newMessage = newMessage.replace('[start]', start);
        }

        if (this.state.eventEndTime !== null && this.state.eventEndTime.length === 3 && newMessage.includes('[end]')) {
            const end = this.state.eventEndTime[0] + ':' + this.state.eventEndTime[1].toString().padStart(2, '0') + ' ' + this.state.eventEndTime[2];
            newMessage = newMessage.replace('[end]', end);
        }

        if (this.state.eventLocation !== '' && newMessage.includes('[location]')) {
            newMessage = newMessage.replace('[location]', this.state.eventLocation);
        }

        this.setState({eventMessage: newMessage});
    }

    submitEvent() {
        if (!this.props.userProfile) {
            this.props.handleFailure('User is not authenticated');
            return;
        }

        const dateTime = this.parseDateTime();
        if (dateTime == null) {
            // TODO: Display error to the user, end time before start time
            return;
        }

        const newEvent = {
            name: this.state.eventName,
            location: this.state.eventLocation,
            message: this.state.eventMessage,
            duration: dateTime['duration'],
            date: dateTime['date'],
            time: dateTime['time']
        };

        this.props.db.collection(DbConstants.USERS)
            .doc(this.props.userProfile.getUid())
            .collection(DbConstants.EVENTS)
            .add(newEvent)
            .then(docRef => {
                console.log('Successfully created a new event');
                this.props.handleSuccess(newEvent);
            })
            .catch(error => {
                console.error('Failed to create a new event!');
                this.props.handleFailure(error);
            });
    }

    parseDateTime() {
        const startTime = this.state.eventStartTime;
        const endTime = this.state.eventEndTime;
        if (startTime.length !== 3 || endTime.length !== 3) {
            // TODO: Display an error to the user
            return;
        }

        let durationHours;
        let durationMinutes;
        if (startTime[2] === endTime[2]) {
            // Start and end times are both AM or PM
            durationHours = endTime[0] - startTime[0];
            durationMinutes = endTime[1] - startTime[1];
        } else {
            // Start and end times are different AM or PM
            durationHours = (12 + endTime[0]) - startTime[0];
            durationMinutes = endTime[1] - startTime[1];
        }

        if (durationMinutes < 0) {
            // Adjustment for when end minute is before start minute
            durationMinutes += 60;
            durationHours--;
        }

        if (durationMinutes < 0 || durationMinutes < 0) {
            // TODO: Display error if end time is before start time
            return null;
        }

        return {
            time: {
                hour: startTime[0],
                minute: startTime[1],
                timeOfDay: startTime[2]
            },
            date: {
                month: this.state.eventDateMonth + 1,
                day: this.state.eventDate,
                year: this.state.eventDateYear
            },
            duration: {
                hours: durationHours,
                minutes: durationMinutes
            }
        }
    }

    clickEventDate() {
        const showing = this.state.showEventDatePicker;
        this.setState({showEventDatePicker: !showing});
    }

    setEventDate(date) {
        this.setState({
            eventDate: date.getDate(),
            eventDateMonth: date.getMonth(),
            eventDateYear: date.getFullYear(),
            eventDateWeekDay: date.getDay()
        });
    }

    setEventStartTime(timeList) {
        this.setState({eventStartTime: timeList});
    }

    setEventEndTime(timeList) {
        this.setState({eventEndTime: timeList});
    }

    render() {
        return (
            <div className={'create-new-event'}>
                <h3>title</h3>
                <InputField className={'input-event-name'} type={'text'} name={'eventName'} placeholder={'new event'} value={this.state.eventName} onChange={this.handleChange}/>

                <h3>date + time</h3>
                <div>
                    <h4>date</h4>
                    <DatePicker startDate={this.date}
                                setDate={this.setEventDate}
                                months={this.months}
                                monthLengths={this.monthLengths}
                                weekDays={this.weekDays}
                                length={200}/>
                </div>
                <div className={'display-flex space-between-wrap'}>
                    <div>
                        <h4>start time</h4>
                        <TimePicker startTime={this.state.eventStartTime}
                                    setTime={this.setEventStartTime}/>
                    </div>

                    <div>
                        <h4>end time</h4>
                        <TimePicker startTime={this.state.eventEndTime}
                                    setTime={this.setEventEndTime}/>
                    </div>
                </div>

                <h3>location</h3>
                <InputField className={'input-event-location'} type={'text'} name={'eventLocation'} placeholder={'add location'} value={this.state.eventLocation} onChange={this.handleChange}/>

                {/*<h3>friends</h3>*/}
                {/*<div>don't know her</div>*/}
                {/*<div>confused where these come from</div>*/}

                <h3>message</h3>
                <textarea className={'new-event-message'} name={'eventMessage'} value={this.state.eventMessage} onChange={this.handleChange} onFocus={this.populateEventParameters}/>

                {/*<h3>include poll</h3>*/}
                {/*<div>probably never gonna be able to do this</div>*/}

                {/*<h3>send invite via</h3>*/}
                {/*<div>most definitely only email</div>*/}

                {/*<h3>reminder</h3>*/}
                {/*<div>who is this reminder for?</div>*/}

                {/*<h3>request response by</h3>*/}
                {/*<input className={'input-event-location'} type={'text'} name={'eventDateTime'} placeholder={'Add date/time'} value={this.state.eventDateTime}*/}
                {/*onChange={this.handleInputChange}/>*/}

                <button className={'btn-primary btn-create-event'} onClick={this.submitEvent}>create event</button>
            </div>
        );
    }
}

class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.dates = [];
        this.monthLengths = this.props.monthLengths;
        this.startDate = this.props.startDate;
        this.displayDate = this.startDate;
        this.weekDays = this.props.weekDays;
        this.months = this.props.months;
        this.setDate = this.props.setDate;
        this.length = this.props.length;
        this.state = {
            showPicker: false
        };

        this.clickEventDate = this.clickEventDate.bind(this);
        this.clickDate = this.clickDate.bind(this);

        const firstDate = this.startDate.getDate();
        for (let i = 0; i < this.length; i++) {
            const newDate = new Date(this.startDate);
            newDate.setDate(firstDate + i);
            this.dates.push(newDate);
        }
    }

    clickEventDate() {
        const showing = this.state.showPicker;
        this.setState({showPicker: !showing});
    }

    clickDate(event) {
        const fullDate = event.target.innerText;
        const split = fullDate.indexOf(' ') + 1; // Get index to separate weekday from date
        const dateStr = fullDate.substring(split); // Get the date without the weekday
        const date = new Date(dateStr);

        this.setState({showPicker: false});
        this.displayDate = date;
        this.setDate(date);
    }

    render() {
        return (
            <div className={'date-time'}>
                <button className={'btn-date-time'} onClick={this.clickEventDate}>
                    {this.weekDays[this.displayDate.getDay()][1]}. {this.months[this.displayDate.getMonth()]} {this.displayDate.getDate()} {this.displayDate.getFullYear()}
                </button>
                {this.state.showPicker && <div className={'picker'}>
                    {this.dates.map(date => {
                        return (
                            <button className={'picker-inner'} onClick={this.clickDate} key={date}>
                                {this.weekDays[date.getDay()][1]}. {this.months[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear()}
                            </button>
                        );
                    })}
                </div>}
            </div>
        );
    }
}

class TimePicker extends Component {
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

export default NewEvent;
