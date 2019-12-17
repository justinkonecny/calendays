import React, {Component} from 'react';
import NewEvent from './NewEvent';
import '../css/Calendar.css'
import {CalendarDay} from "./CalendayDay";
import {MonthNames, WeekDayNames} from "./Constants";

const ColumnPos = {
    LEFT: 'calendar-column-left',  // Indicates the left column of a calendar
    MIDDLE: 'calendar-column-middle', // Indicates a center column of a calendar
    RIGHT: 'calendar-column-right'  // Indicates the right column of a calendar
};

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.renderEventsForWeek = this.renderEventsForWeek.bind(this);
        this.getPopulatedDates = this.getPopulatedDates.bind(this);
        this.queryForEvents = this.queryForEvents.bind(this);
        this.toggleNewEvent = this.toggleNewEvent.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleFailure = this.handleFailure.bind(this);
        this.showNextWeek = this.showNextWeek.bind(this);
        this.showPrevWeek = this.showPrevWeek.bind(this);

        this.date = new Date();  // Today's dateDay
        this.dateMap = {};  // Used to map dateDay (day) to day of week (index of dayClasses)

        this.state = {
            dayClasses: [],  // The list of Calendar days
            showNewEvent: false,  // Don't show the new event creator after load
            displayedWeek: 0, // Index of first day of the week being displayed
            displayedDate: this.date, // Date of first day of the week being displayed
            events: []  // List of events from the database
        };

        this.weekNames = WeekDayNames;  // List of days of the week (full and abbreviated names)
        this.monthNames = MonthNames;  // List of months (full names)

        // Populate the first week with seven CalendarDays
        const firstWeek = [];
        for (let i = 0; i < 7; i++) {
            let pos = ColumnPos.MIDDLE;
            if (i === 0) {
                pos = ColumnPos.LEFT;
            } else if (i === 6) {
                pos = ColumnPos.RIGHT;
            }
            firstWeek.push(new CalendarDay(i, pos));
        }
        this.state.dayClasses = firstWeek;

        this.queryForEvents(0);

        this.monthLengths = [];  // The number of days in each dateMonth (by index)
        for (let i = 1; i <= 12; i++) {
            const lastDate = new Date(this.date.getFullYear(), i, 0);
            this.monthLengths.push(lastDate.getDate());
        }

        const dayDate = this.date.getDate();
        const weekIndex = this.date.getDay();
        this.state.dayClasses[weekIndex].setDayMonth(dayDate).setToday(true);  // Sets this dateDay as 'today'

        // this.populateDates(this.date, 0);  // Sets the dateDay for each day of the week
        this.state.dayClasses = this.getPopulatedDates(this.date, 0);
        this.state.displayedDate = this.state.dayClasses[0].getDate();

        this.times = [];  // List of times displayed on the side of the calendar
        for (let i = 7; i < 20; i++) {
            if (i === 12) {
                this.times.push('12 pm');
            } else if (i > 12) {
                this.times.push((i - 12) + ' pm');
            } else {
                this.times.push(i + ' am');
            }
        }

        const rowHeight = {height: 'calc(' + (100 / this.times.length) + '% - 2px)'};  // Height of each row in the calendar
        this.times = this.times.map(time => {
            return (
                <div className={'row-time'} style={rowHeight} key={'rowTime' + time.replace(' ', '_')}>
                    <span className={'time'}>{time}</span>
                </div>
            );
        });
    }

    queryForEvents(displayedWeek) {
        // Populate the list of events with the Firebase results
        const userEvents = this.props.db.collection('users').doc(this.props.user.uid).collection('events');
        userEvents.get().then(doc => {
            if (doc.empty) {
                // TODO: Display error to user
                console.error('No doc found');
                console.error(doc);
            } else {
                const events = [];
                doc.docs.forEach(docQuery => {
                    events.push(docQuery.data());
                });
                this.setState({events});
                this.renderEventsForWeek(displayedWeek);
            }
        });
    }

    getPopulatedDates(theDate, startOffset) {
        const currDate = theDate.getDate();
        const currDayOfWeek = theDate.getDay();
        if (isNaN(currDate) || isNaN(currDayOfWeek)) {
            // TODO: Show error to the user
        }

        const populatedDays = this.state.dayClasses;
        if (startOffset >= this.state.dayClasses.length) {
            // Adding a week in the future
            for (let i = 0; i < 7; i++) {
                let pos = ColumnPos.MIDDLE;
                if (i === 0) {
                    pos = ColumnPos.LEFT;
                } else if (i === 6) {
                    pos = ColumnPos.RIGHT;
                }
                populatedDays.push(new CalendarDay(i, pos));
            }
        } else if (startOffset < 0) {
            // Adding a week in the past
            for (let i = 6; i >= 0; i--) {
                let pos = ColumnPos.MIDDLE;
                if (i === 0) {
                    pos = ColumnPos.LEFT;
                } else if (i === 6) {
                    pos = ColumnPos.RIGHT;
                }
                populatedDays.unshift(new CalendarDay(i, pos));
            }
            startOffset = 0;
        }

        for (let i = 0; i < 7; i++) {
            const diff = currDayOfWeek - i;
            const newDay = currDate - diff;
            const newDate = new Date(theDate);
            newDate.setDate(newDay);
            populatedDays[i + startOffset].setDate(newDate);
        }

        return populatedDays;
    }

    toggleNewEvent() {
        const isShowing = this.state.showNewEvent;
        this.setState({showNewEvent: !isShowing});
    }

    handleSuccess(event) {
        const events = this.state.events;
        events.push(event);
        this.setState({showNewEvent: false, events});
        this.renderEventsForWeek(this.state.displayedWeek);
    }

    handleFailure(error) {
        console.error('Error creating event');
        console.error(error);
    }

    renderEventsForWeek(displayedWeek) {
        const startDate = this.state.displayedDate;
        const events = this.state.events;
        const toRemove = [];
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const dbDate = event.date;
            const dateStr = parseInt(dbDate.month) + '/' + parseInt(dbDate.day) + '/' + parseInt(dbDate.year);
            const date = new Date(dateStr);

            if (date.getFullYear() === startDate.getFullYear()
                && date.getMonth() === startDate.getMonth()
                && date.getDate() >= startDate.getDate()
                && date.getDate() <= startDate.getDate() + 7) {

                // Match has been found
                toRemove.push(i);  // Add this event's index to the list to remove the event

                const eventDayOfWeek = date.getDay();
                const eventIndex = eventDayOfWeek + displayedWeek;

                this.state.dayClasses[eventIndex].renderEvent(event);
            }
        }

        for (let i = (toRemove.length - 1); i >= 0; i--) {
            const index = toRemove[i];
            events.splice(index, 1);
        }

        if (toRemove.length > 0) {
            this.setState({events});
        }
    }

    showNextWeek() {
        // TODO: Use state to update
        const newDisplayedWeek = this.state.displayedWeek + 7;
        const date = this.state.displayedDate;
        date.setDate(date.getDate() + 7);
        if (newDisplayedWeek > (this.state.dayClasses.length - 1)) {
            // Add a new week to the list
            const days = this.getPopulatedDates(date, newDisplayedWeek);
            this.setState({dayClasses: days});
        }
        this.setState({displayedWeek: newDisplayedWeek, displayedDate: date});
        this.renderEventsForWeek(newDisplayedWeek);
    }

    showPrevWeek() {
        // TODO: Use state to update
        let newDisplayedWeek = this.state.displayedWeek - 7;
        const date = this.state.displayedDate;
        date.setDate(date.getDate() - 7);
        if (newDisplayedWeek < 0) {
            // Add a new week to the list
            const days = this.getPopulatedDates(date, newDisplayedWeek);
            newDisplayedWeek = 0;
            this.setState({dayClasses: days});
        }
        this.setState({displayedWeek: newDisplayedWeek, displayedDate: date});
        this.renderEventsForWeek(newDisplayedWeek);
    }

    render() {
        const columms = this.state.dayClasses.slice(this.state.displayedWeek, this.state.displayedWeek + 7).map(day => {
            day.setTimesCount(this.times.length);
            return day.getComponent(this.state.showNewEvent);
        });

        return (
            <div className={'calendar-container-outer'}>
                {this.state.showNewEvent && <NewEvent user={this.props.user}
                                                      db={this.props.db}
                                                      handleSuccess={this.handleSuccess}
                                                      handleFailure={this.handleFailure}
                                                      months={this.monthNames}
                                                      monthLengths={this.monthLengths}
                                                      weekDays={this.weekNames}/>}
                <div className={this.state.showNewEvent ? 'calendar-container calendar-container-half' : 'calendar-container'}>
                    <div className={'calendar-header'}>
                        <h2 className={this.state.showNewEvent ? 'calendar-header-left calendar-header-left-half' : 'calendar-header-left'}>
                            {this.monthNames[this.state.displayedDate.getMonth()]} {this.state.displayedDate.getFullYear()}
                        </h2>
                        <div className={'calendar-header-right'}>
                            <button className={'btn-primary btn-new-event'} onClick={this.toggleNewEvent}>new event</button>
                        </div>
                    </div>
                    <div className={'calendar'} id={'calendar'}>
                        <div className={this.state.showNewEvent ? 'calendar-column column-time column-time-half' : 'calendar-column column-time'}>
                            <div className={'column-header column-time-header'}>
                                <button onClick={this.showPrevWeek}>
                                    L
                                </button>
                            </div>
                            <div className={'container-times'}>
                                {this.times}
                            </div>
                        </div>
                        {columms}
                        <button style={{height: '50px'}} onClick={this.showNextWeek}>
                            R
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Calendar;
