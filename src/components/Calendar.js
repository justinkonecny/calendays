import React, {Component} from 'react';
import NewEvent from './NewEvent';
import '../css/Calendar.css'

const ColumnEnd = {
    LEFT: 'calendar-column-left',  // Indicates the left column of a calendar
    RIGHT: 'calendar-column-right'  // Indicates the right column of a calendar
};

class Calendar extends Component {

    constructor(props) {
        super(props);
        this.toggleNewEvent = this.toggleNewEvent.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleFailure = this.handleFailure.bind(this);

        this.date = new Date();
        this.dateMap = {};  // Used to map date (day) to day of week (index of dayClasses)

        this.state = {
            showNewEvent: false,
            events: []
        };

        this.dayClasses = [
            new CalendarDay('Sunday', 'sun', ColumnEnd.LEFT),
            new CalendarDay('Monday', 'mon'),
            new CalendarDay('Tuesday', 'tues'),
            new CalendarDay('Wednesday', 'wed'),
            new CalendarDay('Thursday', 'thurs'),
            new CalendarDay('Friday', 'fri'),
            new CalendarDay('Saturday', 'sat', ColumnEnd.RIGHT)
        ];

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

    }

    populateDates(currDate, currDayOfWeek) {
        // TODO: Move to onComponentWillMount?
        for (let i = 0; i < this.dayClasses.length; i++) {
            const diff = currDayOfWeek - i;
            const day = currDate - diff;
            this.dayClasses[i].setDayMonth(day);
            this.dateMap[day] = i;
            // TODO: Fix when out of range of month
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

            // TODO: Fix this to work at month and and beginning

            if (date.year === startDate.year
                && date.month === startDate.month
                && date.day in this.dateMap) {

                const dayOfWeek = this.dateMap[date.day];
                this.dayClasses[dayOfWeek].renderEvent(event);
            }
        }
    }

    render() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        const dayOfMonth = this.date.getDate();
        const dayOfWeek = this.date.getDay();

        this.dayClasses[dayOfWeek].setDayMonth(dayOfMonth).setToday(true);
        this.populateDates(dayOfMonth, dayOfWeek);

        let times = [];
        for (let i = 7; i < 20; i++) {
            if (i === 12) {
                times.push('12 pm');
            } else if (i > 12) {
                times.push((i - 12) + ' pm');
            } else {
                times.push(i + ' am');
            }
        }

        const rowHeight = {height: 'calc(' + (100 / times.length) + '% - 2px)'};
        times = times.map(time => {
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

        const columns = this.dayClasses.map(day => {
            day.setTimesCount(times.length);
            return day.render();
        });

        return (
            <div className={'calendar-container-outer'}>
                {this.state.showNewEvent && <NewEvent user={this.props.user} db={this.props.db} handleSuccess={this.handleSuccess} handleFailure={this.handleFailure}/>}
                <div className={this.state.showNewEvent ? 'calendar-container calendar-container-half' : 'calendar-container'}>
                    <div className={'calendar-header'}>
                        <h2 className={this.state.showNewEvent ? 'calendar-header-left calendar-header-left-half' : 'calendar-header-left'}>
                            {monthNames[this.date.getMonth()]} {this.date.getFullYear()}
                        </h2>
                        <div className={'calendar-header-right'}>
                            <button className={'btn-primary btn-new-event'} onClick={this.toggleNewEvent}>new event</button>
                        </div>
                    </div>
                    <div className={'calendar'} id={'calendar'}>
                        <div className={this.state.showNewEvent ? 'calendar-column column-time column-time-half' : 'calendar-column column-time'}>
                            <div className={'column-header column-time-header'}/>
                            <div className={'container-times'}>
                                {times}
                            </div>
                        </div>
                        {columns}
                    </div>
                </div>
            </div>
        );
    }
}

class CalendarDay {

    constructor(name, displayName, columnEnd) {
        this.name = name;
        this.displayName = displayName;
        this.columnEnd = columnEnd;
        this.isToday = false;
        this.dayOfMonth = -1;
        this.events = [];
    }

    setDayMonth(num) {
        this.dayOfMonth = num;
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
                    <h4>{event.name}</h4>
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

        const columnClass = this.columnEnd == null ? 'calendar-column' : 'calendar-column ' + this.columnEnd;

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
                        {this.dayOfMonth}
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
