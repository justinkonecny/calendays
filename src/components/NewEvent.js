import React, {Component} from 'react';
import '../css/NewEvent.css';

class NewEvent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventName: '',
            eventDateTime: '',
            eventLocation: '',
            eventMessage: 'Hey! Are you free for [event title] on [event date] from [event start] to [event end]?'
        };
        this.handleChange = this.handleChange.bind(this);
        this.populateEventName = this.populateEventName.bind(this);
        this.submitEvent = this.submitEvent.bind(this);
        this.parseDateTime = this.parseDateTime.bind(this);
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

    render() {
        return (
            <div className={'create-new-event'}>
                <input className={'input-event-name'} type={'text'} name={'eventName'} placeholder={'new event'} value={this.state.eventName} onChange={this.handleChange}/>

                <h3>date + time</h3>
                <input className={'input-event-location'} type={'text'} name={'eventDateTime'} placeholder={'mm/dd/yy hh:mm am|pm'} value={this.state.eventDateTime}
                       onChange={this.handleChange}/>

                <h3>location</h3>
                <input className={'input-event-location'} type={'text'} name={'eventLocation'} placeholder={'Add location'} value={this.state.eventLocation}
                       onChange={this.handleChange}/>

                <h3>friends</h3>
                <div>don't know her</div>
                <div>confused where these come from</div>

                <h3>message</h3>
                <textarea className={'new-event-message'} name={'eventMessage'} value={this.state.eventMessage} onChange={this.handleChange} onFocus={this.populateEventName}/>

                <h3>include poll</h3>
                <div>probably never gonan be able to do this</div>

                <h3>send invite via</h3>
                <div>most definitely only email</div>

                <h3>reminder</h3>
                <div>who is this reminder for?</div>

                <h3>request response by</h3>
                <input className={'input-event-location'} type={'text'} name={'eventDateTime'} placeholder={'Add date/time'} value={this.state.eventDateTime}
                       onChange={this.handleChange}/>

                <button className={'btn-primary btn-create-event'} onClick={this.submitEvent}>create event</button>
            </div>
        );
    }
}

export default NewEvent;
