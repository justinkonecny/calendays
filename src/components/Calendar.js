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
    ['Saturday', 'Sat']
];

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.renderEventsForWeek = this.renderEventsForWeek.bind(this);
        this.toggleNewEvent = this.toggleNewEvent.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleFailure = this.handleFailure.bind(this);
        this.showNextWeek = this.showNextWeek.bind(this);
        this.showPrevWeek = this.showPrevWeek.bind(this);

        this.date = new Date();  // Today's dateDay
        this.dateMap = {};  // Used to map dateDay (day) to day of week (index of dayClasses)

        this.state = {
            showNewEvent: false,  // Don't show the new event creator after load
            displayedWeek: 0, // Index of first day of the week being displayed
            displayedDate: this.date, // Date of first day of the week being displayed
            events: []  // List of events from the database
        };

        // List of days of the week (full and abbreviated names)
        this.weekNames = [
            ['Sunday', 'Sun'],
            ['Monday', 'Mon'],
            ['Tuesday', 'Tues'],
            ['Wednesday', 'Wed'],
            ['Thursday', 'Thurs'],
            ['Friday', 'Fri'],
            ['Saturday', 'Sat']
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

        this.monthLengths = [];  // The number of days in each dateMonth (by index)
        for (let i = 1; i <= 12; i++) {
            const lastDate = new Date(this.date.getFullYear(), i, 0);
            this.monthLengths.push(lastDate.getDate());
        }

        const dayDate = this.date.getDate();
        const weekIndex = this.date.getDay();
        this.dayClasses[weekIndex].setDayMonth(dayDate).setToday(true);  // Sets this dateDay as 'today'

        this.populateDates(this.date, 0);  // Sets the dateDay for each day of the week
        this.state.displayedDate = this.dayClasses[0].getDate();

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

    populateDates(theDate, startOffset) {
        const currDate = theDate.getDate();
        const currDayOfWeek = theDate.getDay();
        if (isNaN(currDate) || isNaN(currDayOfWeek)) {
            // TODO: Show error to the user
        }

        if (startOffset >= this.dayClasses.length) {
            for (let i = 0; i < 7; i++) {
                let pos = ColumnPos.MIDDLE;
                if (i === 0) {
                    pos = ColumnPos.LEFT;
                } else if (i === 6) {
                    pos = ColumnPos.RIGHT;
                }
                this.dayClasses.push(new CalendarDay(i, pos));
            }
        } else if (startOffset < 0) {
            for (let i = 6; i >= 0; i--) {
                let pos = ColumnPos.MIDDLE;
                if (i === 0) {
                    pos = ColumnPos.LEFT;
                } else if (i === 6) {
                    pos = ColumnPos.RIGHT;
                }
                this.dayClasses.unshift(new CalendarDay(i, pos));
            }
            startOffset = 0;
        }

        for (let i = 0; i < 7; i++) {
            const diff = currDayOfWeek - i;
            const newDay = currDate - diff;
            const newDate = new Date(theDate);
            newDate.setDate(newDay);
            this.dayClasses[i + startOffset].setDate(newDate);
            this.dateMap[newDate] = i;
        }
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

            // TODO: Fix this to work at dateMonth and and beginning
            console.log(date.year);
            console.log(date.month);
            console.log(date.day);
            console.log(startDate);

            if (date.year === startDate.getFullYear()
                && date.month === startDate.getMonth() + 1
                && date.day >= startDate.getDate()
                && date.day <= startDate.getDate() + 7) {


                //get day of week of date
                // add that to state.displayedWeek
                const dayOfWeek = startDate.getDay();
                const index = dayOfWeek + this.state.displayedWeek;
                console.log(dayOfWeek);
                console.log(this.state.displayedWeek);
                this.dayClasses[index].renderEvent(event);
            }
        }
    }

    showNextWeek() {
        // TODO: Use state to update
        const newDisplayedWeek = this.state.displayedWeek + 7;
        const date = this.state.displayedDate;
        date.setDate(date.getDate() + 7);
        if (newDisplayedWeek > (this.dayClasses.length - 1)) {
            // Add a new week to the list
            this.populateDates(date, newDisplayedWeek);
        }
        this.setState({displayedWeek: newDisplayedWeek, displayedDate: date});
    }

    showPrevWeek() {
        // TODO: Use state to update
        let newDisplayedWeek = this.state.displayedWeek - 7;
        const date = this.state.displayedDate;
        date.setDate(date.getDate() - 7);
        if (newDisplayedWeek < 0) {
            // Add a new week to the list
            this.populateDates(date, newDisplayedWeek);
            newDisplayedWeek = 0;
        }
        this.setState({displayedWeek: newDisplayedWeek, displayedDate: date});
    }

    render() {
        const columms = this.dayClasses.slice(this.state.displayedWeek, this.state.displayedWeek + 7).map(day => {
            day.setTimesCount(this.times.length);
            return day.render();
        });

        this.renderEventsForWeek(this.state.displayedDate);

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

class CalendarDay {
    constructor(weekDayIndex, columnPos) {
        this.weekDay = WeekDayNames[weekDayIndex];
        // TODO: Assert weekDayIndex in range
        this.name = this.weekDay[0];
        this.displayName = this.weekDay[1].toLowerCase();
        this.columnPos = columnPos;
        this.isToday = false;
        this.dateMonth = -1;
        this.dateDay = -1;
        this.date = new Date();
        this.events = [];
    }

    setDate(date) {
        this.date = date;
        this.dateMonth = date.getMonth();
        this.dateDay = date.getDate();
        return this;
    }

    setDayMonth(num) {
        this.dateDay = num;
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

    getDate() {
        return this.date;
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
                        {this.dateDay}
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
