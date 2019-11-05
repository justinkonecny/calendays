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

    setEventDate(event) {
        const date = new Date(event.target.innerText);
        this.setState({
            showEventDatePicker: false,
            eventDateDay: date.getDate(),
            eventDateMonth: date.getMonth(),
            eventDateYear: date.getFullYear(),
            eventDateWeekDay: date.getDay()
        });
    }


    render() {
        return (
            <div className={'create-new-event'}>
                <input className={'input-event-name'} type={'text'} name={'eventName'} placeholder={'new event'} value={this.state.eventName} onChange={this.handleChange}/>

                <h3>date + time</h3>
                {/*<input className={'input-event-location'} type={'text'} name={'eventDateTime'} placeholder={'mm/dd/yy hh:mm am|pm'} value={this.state.eventDateTime} onChange={this.handleChange}/>*/}
                <div className={'date-time'}>
                    <button className={'btn-date-time'} onClick={this.clickEventDate}>
                        {this.weekDays[this.state.eventDateWeekDay][1]}. {this.months[this.state.eventDateMonth]} {this.state.eventDateDay} {this.state.eventDateYear}
                    </button>
                    {this.state.showEventDatePicker && <DatePicker setDate={this.setEventDate} months={this.months} monthLengths={this.monthLengths} weekDays={this.weekDays}/>}
                </div>

                <h3>location</h3>
                <input className={'input-event-location'} type={'text'} name={'eventLocation'} placeholder={'Add location'} value={this.state.eventLocation}
                       onChange={this.handleChange}/>

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

        const currDate = new Date();
        let currDay = currDate.getDate();
        let currMonth = currDate.getMonth();
        let currYear = currDate.getFullYear();
        for (let i = 1; i < 100; i ++) {
            if (currDay === this.monthLengths[currMonth]) {
                currMonth += 1;
                currDay = 0;

                if (currMonth >= 12) {
                    currMonth = currMonth % 12;
                    currYear += 1;
                }
            }
            const nextDate = currDay += 1;
            let next = this.props.months[currMonth] + ' ' + nextDate + ' ' + currYear;
            this.dates.push(new Date(next));
        }
    }

    render() {
        return (
            <div className={'date-picker'}>
                {this.dates.map(date => {
                    return (
                        <button className={'date-picker-inner'} onClick={this.props.setDate}>
                            {this.props.weekDays[date.getDay()][1]}. {this.props.months[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear()}
                        </button>
                    );
                })}
            </div>
        );
    }
}

export default NewEvent;
