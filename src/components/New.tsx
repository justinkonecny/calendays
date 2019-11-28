import React, {Component} from 'react';
import '../css/NewEvent.scss';

class NewEvent extends Component {

    constructor(props) {
        super(props);
        this.date = new Date();
        this.months = this.props.months;
        this.monthLengths = this.props.monthLengths;
        this.weekDays = this.props.weekDays;
        this.state = {
            eventName: '',
            eventDateMonth: this.date.getMonth(),
            eventDateDay: this.date.getDate(),
            eventDateYear: this.date.getFullYear(),
            eventDateWeekDay: this.date.getDay(),
            eventLocation: '',
            eventMessage: 'Hey! Are you free for [event title] on [event date] from [event start] to [event end]?'
        };
        this.handleChange = this.handleChange.bind(this);
        this.populateEventName = this.populateEventName.bind(this);
        this.submitEvent = this.submitEvent.bind(this);
        this.parseDateTime = this.parseDateTime.bind(this);
        this.clickEventDate = this.clickEventDate.bind(this);
        this.setEventDate = this.setEventDate.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    populateEventName() {
        if (this.state.eventName !== '' && this.state.eventMessage.includes('[event title]')) {
            const newMessage = this.state.eventMessage.replace('[event title]', this.state.eventName);
            this.setState({eventMessage: newMessage});
        }
    }

    submitEvent() {
        if (!this.props.user) {
            this.props.handleFailure('User is not authorized');
            return;
        }

        const dateTime = this.parseDateTime();
        const date = dateTime['date'];
        const time = dateTime['time'];

        this.props.db.collection('users')
            .doc(this.props.user.uid)
            .collection('events')
            .add({
                name: this.state.eventName,
                location: this.state.eventLocation,
                message: this.state.eventMessage,
                date,
                time
            })
            .then(docRef => {
                this.props.handleSuccess(docRef);
            })
            .catch(error => {
                this.props.handleFailure(error);
            });
    }

    parseDateTime() {
        const dateTime = this.state.eventDateTime.split(' ');
        if (dateTime.length !== 3) {
            // TODO: Display an error to the user
            return;
        }

        const date = dateTime[0].split('/');
        const time = dateTime[1].split(':');
        const tod = dateTime[2]; // TODO: Convert to 24hr

        if (date.length !== 3) {
            // TODO: Display an error to the user
            return;
        } else if (time.length !== 2) {
            // TODO: Display an error to the user
            return;
        }

        if (tod.toLowerCase() === 'pm') {
            time[0] = parseInt(time[0]) + 12;
        }

        // TODO: Add date and time validation

        return {
            time: {
                hour: parseInt(time[0]),
                minute: parseInt(time[1])
            },
            date: {
                month: parseInt(date[0]),
                day: parseInt(date[1]),
                year: parseInt(date[2])
            }
        }
    }

    clickEventDate() {
        const showing = this.state.showEventDatePicker;
        this.setState({showEventDatePicker: !showing});
    }

    setEventDate(date) {
        this.setState({
            eventDateDay: date.getDate(),
            eventDateMonth: date.getMonth(),
            eventDateYear: date.getFullYear(),
            eventDateWeekDay: date.getDay()
        });
    }

    setEventTime(timeList) {

    }

    render() {
        return (
            <div className={'create-new-event'}>
                <input className={'input-event-name'} type={'text'} name={'eventName'} placeholder={'new event'} value={this.state.eventName} onChange={this.handleChange}/>

                <h3>date + time</h3>
                {/*<input className={'input-event-location'} type={'text'} name={'eventDateTime'} placeholder={'mm/dd/yy hh:mm am|pm'} value={this.state.eventDateTime} onChange={this.handleChange}/>*/}

                <DatePicker startDate={this.date}
                            setDate={this.setEventDate}
                            months={this.months}
                            monthLengths={this.monthLengths}
                            weekDays={this.weekDays}/>

                <TimePicker startTime={[5, 30, TimeOfDay.PM]}
                            setTime={this.setEventTime}/>

                <h3>location</h3>
                <input className={'input-event-location'} type={'text'} name={'eventLocation'} placeholder={'Add location'} value={this.state.eventLocation} onChange={this.handleChange}/>

                {/*<h3>friends</h3>*/}
                {/*<div>don't know her</div>*/}
                {/*<div>confused where these come from</div>*/}

                <h3>message</h3>
                <textarea className={'new-event-message'} name={'eventMessage'} value={this.state.eventMessage} onChange={this.handleChange} onFocus={this.populateEventName}/>

                {/*<h3>include poll</h3>*/}
                {/*<div>probably never gonna be able to do this</div>*/}

                {/*<h3>send invite via</h3>*/}
                {/*<div>most definitely only email</div>*/}

                {/*<h3>reminder</h3>*/}
                {/*<div>who is this reminder for?</div>*/}

                {/*<h3>request response by</h3>*/}
                {/*<input className={'input-event-location'} type={'text'} name={'eventDateTime'} placeholder={'Add date/time'} value={this.state.eventDateTime}*/}
                {/*onChange={this.handleChange}/>*/}

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

        this.state = {
            showPicker: false
        };

        let currDay = this.startDate.getDate();
        let currMonth = this.startDate.getMonth();
        let currYear = this.startDate.getFullYear();

        for (let i = 1; i < 100; i++) {
            if (currDay === this.monthLengths[currMonth]) {
                currMonth += 1;
                currDay = 0;

                if (currMonth >= 12) {
                    currMonth = currMonth % 12;
                    currYear += 1;
                }
            }
            const nextDate = currDay += 1;
            let next = this.months[currMonth] + ' ' + nextDate + ' ' + currYear;
            this.dates.push(new Date(next));
        }

        this.clickEventDate = this.clickEventDate.bind(this);
        this.clickDate = this.clickDate.bind(this);
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
        this.timesHours = [];
        this.timesMinutes = [];
        this.timesOfDay = [];

        this.clickHourPicker = this.clickHourPicker.bind(this);
        this.clickMinutePicker = this.clickMinutePicker.bind(this);
        this.clickTimeOfDayPicker = this.clickTimeOfDayPicker.bind(this);
        this.selectHourFromMenu = this.selectHourFromMenu.bind(this);
        this.selectMinuteFromMenu = this.selectMinuteFromMenu.bind(this);
        this.selectTimeOfDayFromMenu = this.selectTimeOfDayFromMenu.bind(this);

        this.state = {
            displayTime: this.props.startTime,
            showHourPicker: false,
            showMinutePicker: false,
            showTimeOfDayPicker: false
        };

        for (let i = 1; i < 13; i++) {
            const min = (i - 1) * 5;
            this.timesHours.push(i);
            this.timesMinutes.push(min);
        }

        for (const tod in TimeOfDay) {
            this.timesOfDay.push(tod);
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
            event.target.innerText,
            this.state.displayTime[1],
            this.state.displayTime[2]
        ];
        this.setState({
            displayTime,
            showHourPicker: false
        });
    }

    selectMinuteFromMenu(event) {
        const displayTime = [
            this.state.displayTime[0],
            event.target.innerText,
            this.state.displayTime[2]
        ];
        this.setState({
            displayTime,
            showMinutePicker: false
        });
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
        const btnHours = [];
        for (const hour of this.timesHours) {
            btnHours.push(this.getPickerOptionsHtml(hour.toString().padStart(2, '0'), this.selectHourFromMenu));
        }

        const btnMinutes = [];
        for (const minute of this.timesMinutes) {
            btnMinutes.push(this.getPickerOptionsHtml(minute.toString().padStart(2, '0'), this.selectMinuteFromMenu));
        }

        const btnTimesOfDay = [];
        for (const day of this.timesOfDay) {
            btnTimesOfDay.push(this.getPickerOptionsHtml(day.toString().padStart(2, '0'), this.selectTimeOfDayFromMenu));
        }

        return (
            <div className={'display-flex'}>
                {this.getPickerContainer(this.clickHourPicker, this.state.displayTime[0].toString().padStart(2, '0'), btnHours, this.state.showHourPicker)}
                {this.getPickerContainer(this.clickMinutePicker, this.state.displayTime[1].toString().padStart(2, '0'), btnMinutes, this.state.showMinutePicker)}
                {this.getPickerContainer(this.clickTimeOfDayPicker, this.state.displayTime[2], btnTimesOfDay, this.state.showTimeOfDayPicker)}
            </div>
        );
    }
}

const TimeOfDay = {
    AM: 'AM',
    PM: 'PM'
};

export default NewEvent;
