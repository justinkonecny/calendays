import React, {Component} from 'react';
import '../../css/calendar/NewEvent.scss';
import {TimeOfDay} from '../main/Constants';
import InputField from '../common/InputField';
import DropdownTime from '../common/DropdownTime';
import {DropdownDate} from '../common/DropdownDate';
import {UserProfile} from '../../data/UserProfile';
import {DropdownNetwork} from '../common/DropdownNetwork';
import {NetworkGroup} from '../../data/NetworkGroup';
import {NetworkEvent} from '../../data/NetworkEvent';
import {Api} from '../../api';

interface NewEventProps {
    monthLengths: number[];
    userProfile: null | UserProfile;
    handleFailure: (error: any) => void;
    handleSuccess: (event: any) => void;
    networkGroups: NetworkGroup[];
}

interface NewEventState {
    showEventDatePicker: boolean;
    eventName: string;
    eventDateMonth: number;
    eventDate: number;
    eventDateYear: number;
    eventDateWeekDay: number;
    eventStartTime: any[];
    eventEndTime: any;
    eventLocation: string;
    eventMessage: string;
    eventNetwork: NetworkGroup | null;
}

export class NewEvent extends Component<NewEventProps, NewEventState> {
    private date: Date;

    constructor(props: NewEventProps) {
        super(props);
        this.date = new Date();
        this.state = {
            showEventDatePicker: false,
            eventName: '',
            eventDateMonth: this.date.getMonth(),
            eventDate: this.date.getDate(),
            eventDateYear: this.date.getFullYear(),
            eventDateWeekDay: this.date.getDay(),
            eventStartTime: [5, 0, TimeOfDay.PM],
            eventEndTime: [8, 0, TimeOfDay.PM],
            eventNetwork: null,
            eventLocation: '',
            eventMessage: 'Hey! Are you free for [title] on [date] from [start] to [end] at [location]?'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.populateEventParameters = this.populateEventParameters.bind(this);
        this.submitEvent = this.submitEvent.bind(this);
        this.parseDateTime = this.parseDateTime.bind(this);
        this.clickEventDate = this.clickEventDate.bind(this);
        this.setEventDate = this.setEventDate.bind(this);
        this.setEventStartTime = this.setEventStartTime.bind(this);
        this.setEventEndTime = this.setEventEndTime.bind(this);
        this.setEventNetwork = this.setEventNetwork.bind(this);
    }

    handleChange(event: React.MouseEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
        const name: string = event.currentTarget.name;
        const value: string = event.currentTarget.value;
        this.setState((prevState: NewEventState) => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const name: string = event.currentTarget.name;
        const value: string = event.currentTarget.value;
        this.setState((prevState: NewEventState) => {
            return {
                ...prevState,
                [name]: value
            }
        });
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

    async submitEvent() {
        if (!this.props.userProfile) {
            this.props.handleFailure('User is not authenticated');
            return;
        }

        const dateTime = this.parseDateTime();
        if (dateTime == null) {
            // TODO: Display error to the user, end time before start time
            return;
        }

        const startDate = new Date(dateTime.date.month.toString().padStart(2, '0') + "/" + dateTime.date.day.toString().padStart(2, '0') + "/" + dateTime.date.year + " "
            + dateTime.time.hour.toString().padStart(2, '0') + ":" + dateTime.time.minute.toString().padStart(2, '0') + " " + dateTime.time.timeOfDay);

        const endDate = new Date(dateTime.date.month.toString().padStart(2, '0') + "/" + dateTime.date.day.toString().padStart(2, '0') + "/" + dateTime.date.year + " "
            + (dateTime.time.hour + dateTime.duration.hours).toString().padStart(2, '0') + ":" + (dateTime.time.minute + dateTime.duration.minutes).toString().padStart(2, '0') + " " + dateTime.time.timeOfDay);

        console.log(startDate);
        console.log(endDate);

        const newEventDTO = {
            ID: null,
            Name: this.state.eventName,
            Location: this.state.eventLocation,
            Message: this.state.eventMessage,
            StartDate: startDate.toISOString(),
            EndDate: endDate.toISOString(),
            NetworkId: this.state.eventNetwork ? this.state.eventNetwork.getId() : null  // TODO: SHOULD NOT BE NULL
        };

        const response = await Api.createUserEvent(newEventDTO);
        if (response.status === 201) {
            console.log('(NE01) Successfully created new event');
            const e = response.data;
            const newEvent = new NetworkEvent(e.ID, e.Name, e.StartDate, e.EndDate, e.Location, e.Message, e.NetworkId);
            this.props.handleSuccess(newEvent);
        } else {
            console.error('(NE02) Failed to create new event:', response.status);
        }
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

    setEventDate(date: Date) {
        this.setState({
            eventDate: date.getDate(),
            eventDateMonth: date.getMonth(),
            eventDateYear: date.getFullYear(),
            eventDateWeekDay: date.getDay()
        });
    }

    setEventStartTime(timeList: any[]) {
        this.setState({eventStartTime: timeList});
    }

    setEventEndTime(timeList: any[]) {
        this.setState({eventEndTime: timeList});
    }

    setEventNetwork(network: NetworkGroup) {
        this.setState({eventNetwork: network});
    }

    render() {
        return (
            <div className={'create-new-event'}>
                <h3>title</h3>
                <InputField className={'input-event-name'} type={'text'} name={'eventName'} placeholder={'new event'} value={this.state.eventName} onChange={this.handleInputChange}/>

                <h3>date + time</h3>
                <div>
                    <h4>date</h4>
                    <DropdownDate startDate={this.date}
                                  setDate={this.setEventDate}
                                  monthLengths={this.props.monthLengths}
                                  length={200}/>
                </div>
                <div className={'display-flex space-between-wrap'}>
                    <div>
                        <h4>start time</h4>
                        <DropdownTime startTime={this.state.eventStartTime}
                                      setTime={this.setEventStartTime}/>
                    </div>

                    <div>
                        <h4>end time</h4>
                        <DropdownTime startTime={this.state.eventEndTime}
                                      setTime={this.setEventEndTime}/>
                    </div>
                </div>

                <h3>location</h3>
                <InputField className={'input-event-location'} type={'text'} name={'eventLocation'} placeholder={'add location'} value={this.state.eventLocation} onChange={this.handleInputChange}/>

                <h3>message</h3>
                <textarea className={'new-event-message'} name={'eventMessage'} value={this.state.eventMessage} onChange={this.handleChange} onFocus={this.populateEventParameters}/>

                <h3>Network</h3>
                <DropdownNetwork networkList={this.props.networkGroups} setEventNetwork={this.setEventNetwork} direction={'top'}/>

                <button className={'btn-primary btn-create-event'} onClick={this.submitEvent}>create event</button>
            </div>
        );
    }
}
