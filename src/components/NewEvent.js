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
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    populateEventName() {
        if (this.state.eventName !== '' && this.state.eventMessage.includes('[event title]')) {
            const newMessage = this.state.eventMessage.replace('[event title]', this.state.eventName);
            console.log(newMessage);
            this.setState({eventMessage: newMessage});
        }
    }

    render() {
        return (
            <div className={'create-new-event'}>
                <input className={'input-event-name'} type={'text'} name={'eventName'} placeholder={'new event'} value={this.state.eventName} onChange={this.handleChange}/>

                <h3>date + time</h3>
                <input className={'input-event-location'} type={'text'} name={'eventDateTime'} placeholder={'Add date/time'} value={this.state.eventDateTime} onChange={this.handleChange}/>

                <h3>location</h3>
                <input className={'input-event-location'} type={'text'} name={'eventLocation'} placeholder={'Add location'} value={this.state.eventLocation} onChange={this.handleChange}/>

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
                <input className={'input-event-location'} type={'text'} name={'eventDateTime'} placeholder={'Add date/time'} value={this.state.eventDateTime} onChange={this.handleChange}/>

            </div>
        );
    }
}

export default NewEvent;
