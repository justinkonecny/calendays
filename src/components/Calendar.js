import React, {Component} from 'react';
import NewEvent from './NewEvent';
import '../css/Calendar.css'

const ColumnPos = {
    LEFT: 'calendar-column-left',  // Indicates the left column of a calendar
    MIDDLE: 'calendar-column-middle', // Indicates a center column of a calendar
    RIGHT: 'calendar-column-right'  // Indicates the right column of a calendar
};

const MonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
];

const WeekDayNames = [
    ['Sunday', 'Sun'],
    ['Monday', 'Mon'],
    ['Tuesday', 'Tues'],
    ['Wednesday', 'Wed'],
    ['Thursday', 'Thurs'],
    ['Friday', 'Fri'],
    ['Saturday', 'Sat'],
];

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.toggleNewEvent = this.toggleNewEvent.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleFailure = this.handleFailure.bind(this);

        this.date = new Date();  // Today's date
        this.dateMap = {};  // Used to map date (day) to day of week (index of dayClasses)

        this.state = {
            showNewEvent: false,  // Don't show the new event creator after load
            events: [],  // List of events from the database
            displayedWeek: 0 // Index of first day of the week being displayed
        };

        // List of days of the week (full and abbreviated names)
        this.weekNames = [
            ['Sunday', 'Sun'],
            ['Monday', 'Mon'],
            ['Tuesday', 'Tues'],
            ['Wednesday', 'Wed'],
            ['Thursday', 'Thurs'],
            ['Friday', 'Fri'],
            ['Saturday', 'Sat'],
        ]; // TODO: Remove this and use the constant above

        // List of months (full names)
        this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        // TODO: Remove this and use the constant above

        // Populate the first week with seven CalendarDays
        this.dayClasses = [];
        for (let i = 0; i < 7; i++) {
            let pos = ColumnPos.MIDDLE;
            if (i === 0) {
                pos = ColumnPos.LEFT;
            } else if (i === 6) {
                pos = ColumnPos.RIGHT;
            }
            this.dayClasses.push(new CalendarDay(i, pos));
        }

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
            }
        });

        this.monthLengths = [];  // The number of days in each month (by index)
        for (let i = 1; i <= 12; i++) {
            const lastDate = new Date(this.date.getFullYear(), i, 0);
            this.monthLengths.push(lastDate.getDate());
        }

        const dayDate = this.date.getDate();
        const weekIndex = this.date.getDay();
        this.dayClasses[weekIndex].setDayMonth(dayDate).setToday(true);  // Sets this date as 'today'

        this.populateDates(this.date, 0);  // Sets the date for each day of the week

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

        this.renderEventsForWeek({
            'day': this.date.getDate(),
            'month': this.date.getMonth() + 1,
            'year': this.date.getFullYear()
        });

        this.columns = this.dayClasses.map(day => {
            day.setTimesCount(this.times.length);
            return day.render();
        });
    }

    populateDates(theDate, startOffset) {
        const currDate = theDate.getDate();
        const currDayOfWeek = theDate.getDay();
        if (isNaN(currDate) || isNaN(currDayOfWeek)) {
            // TODO: Show error to the user
        }

        for (let i = 0; i < 7; i++) {
            const diff = currDayOfWeek - i;
            const newDay = currDate - diff;
            const newDate = new Date(theDate);
            newDate.setDate(newDay);
            this.dayClasses[i + startOffset].setDate(newDate);
            this.dateMap[newDay] = i;
            // TODO: Fix when out of range of month
        }
    }

    addNextWeek() {

    }

    toggleNewEvent() {
        const isShowing = this.state.showNewEvent;
        this.setState({showNewEvent: !isShowing});
    }

    handleSuccess(docRef) {
        this.setState({showNewEvent: false});
    }

    handleFailure(error) {
        console.error('Error creating event');
        console.error(error);
    }

    renderEventsForWeek(startDate) {
        const events = this.state.events;
        for (const event of events) {
            const date = event.date;

            // TODO: Fix this to work at month and and beginning

            if (date.year === startDate.year
                && date.month === startDate.month
                && date.day in this.dateMap) {

                const dayOfWeek = this.dateMap[date.day];
                this.dayClasses[dayOfWeek].renderEvent(event);
            }
        }
    }

    showNextWeek() {
        // TODO: Use state to update
        const newDisplayedWeek = this.state.displayedWeek + 7;
        if (newDisplayedWeek > (this.dayClasses.length - 1)) {
            // Add a new week to the list

        }
        this.setState({displayedWeek: newDisplayedWeek});
    }

    showPrevWeek() {

    }

    render() {
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
                            {this.monthNames[this.date.getMonth()]} {this.date.getFullYear()}
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
                        {this.columns}
                        <button style={{height: '50px'}} onClick={this.showNextWeek}>
                            R
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

class CalendarDay {
    constructor(weekDayIndex, columnPos) {
        // TODO: Assert weekDayIndex in range
        this.weekDay = WeekDayNames[weekDayIndex];
        this.name = this.weekDay[0];
        this.displayName = this.weekDay[1].toLowerCase();
        this.columnPos = columnPos;
        this.isToday = false;
        this.month = -1;
        this.date = -1;
        this.events = [];
    }

    setDate(date) {
        this.month = date.getMonth();
        this.date = date.getDate();
        return this;
    }

    setDayMonth(num) {
        this.date = num;
        return this;
    }

    setTimesCount(count) {
        this.timesCount = count;
        return this;
    }

    setToday(bool) {
        this.isToday = bool;
        return this;
    }

    renderEvent(event) {
        this.events.push(event);
    }

    render(showNewEvent) {
        const rowHeight = 'calc(' + (100 / this.timesCount) + '% - 2px)';
        const rowHeightStyle = {height: rowHeight};

        const renderedEvents = this.events.map(event => {
            const hour = event.time.hour;
            const eventStyle = {
                height: rowHeight,
                top: ((hour - 7) * (100 / this.timesCount)) + '%'
            };
            return (
                <div className={'calendar-event'} style={eventStyle} key={event.name}>
                    <h5>{event.name}</h5>
                    {/*<div>*/}
                    {/*<p>{event.location}</p>*/}
                    {/*<p>{event.message}</p>*/}
                    {/*</div>*/}
                </div>
            );
        });

        const columnGrid = [];
        for (let i = 0; i < this.timesCount; i++) {
            columnGrid.push(
                <div className={'row-grid'} style={rowHeightStyle} key={'row' + i}/>
            );
        }

        const columnClass = this.columnPos == null ? 'calendar-column' : 'calendar-column ' + this.columnPos;

        let weekdayClass = this.isToday ? 'weekday column-header-today' : 'weekday';
        weekdayClass = showNewEvent ? weekdayClass + ' weekday-half' : weekdayClass;

        let dayClass = this.isToday ? 'day column-header-today' : 'day';
        dayClass = showNewEvent ? dayClass + ' day-half' : dayClass;

        let columnHeaderClass = this.isToday ? 'column-header column-header-today' : 'column-header';
        columnHeaderClass = showNewEvent ? columnHeaderClass + ' column-header-half' : columnHeaderClass;

        return (
            <div className={columnClass} id={this.name} key={this.name}>
                <div className={columnHeaderClass}>
                    <div className={weekdayClass}>
                        {this.displayName}
                    </div>
                    <div className={dayClass}>
                        {this.date}
                    </div>
                </div>
                <div className={'container-events'}>
                    {renderedEvents}
                    {columnGrid}
                </div>
            </div>
        );
    }
}

export default Calendar;
