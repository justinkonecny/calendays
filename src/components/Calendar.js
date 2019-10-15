import React, {Component} from 'react';
import '../css/Calendar.css'

const ColumnEnd = {
    LEFT: 'calendar-column-left',
    RIGHT: 'calendar-column-right'
};

class Day {

    constructor(name, displayName, columnEnd) {
        this.name = name;
        this.displayName = displayName;
        this.columnEnd = columnEnd;
        this.dayMonth = -1;
        this.isToday = false;
    }

    setDayMonth(num) {
        this.dayMonth = num;
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

    render() {
        const columnGrid = [];
        const rowHeight = {height: 'calc(' + (100 / +this.timesCount) + '% - 2px)'};
        for (let i = 0; i < this.timesCount; i++) {
            columnGrid.push(
                <div className={'row-grid'} style={rowHeight}/>
            );
        }

        const columnClass = this.columnEnd == null ? 'calendar-column' : 'calendar-column ' + this.columnEnd;

        return (
            <div className={columnClass} id={this.name}>
                <div className={this.isToday ? 'column-header column-header-today' : 'column-header'}>
                    <div className={this.isToday ? 'weekday column-header-today' : 'weekday'}>
                        {this.displayName}
                    </div>
                    <div className={this.isToday ? 'day column-header-today' : 'day'}>
                        {this.dayMonth}
                    </div>
                </div>
                <div className={'container-events'}>
                    {columnGrid}
                </div>
            </div>
        );
    }
}

class Calendar extends Component {

    constructor(props) {
        super(props);

        this.dayClasses = [
            new Day('Sunday', 'sun', ColumnEnd.LEFT),
            new Day('Monday', 'mon'),
            new Day('Tuesday', 'tues'),
            new Day('Wednesday', 'wed'),
            new Day('Thursday', 'thurs'),
            new Day('Friday', 'fri'),
            new Day('Saturday', 'sat', ColumnEnd.RIGHT),
        ];

    }

    populateDates(currDate, currDayOfWeek) {
        for (let i = 0; i < this.dayClasses.length; i++) {
            const diff = currDayOfWeek - i;
            this.dayClasses[i].setDayMonth(currDate - diff);
            // TODO: Fix when out of range of month
        }
    }

    render() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        const date = new Date();
        const dayOfMonth = date.getDate();
        const dayOfWeek = date.getDay();

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

        const rowHeight = {height: 'calc(' + (100 / +times.length) + '% - 2px)'};
        times = times.map(time => {
            return (
                <div className={'row-time'} style={rowHeight}>
                    <span className={'time'}>{time}</span>
                </div>
            );
        });

        const columns = this.dayClasses.map(day => {
            day.setTimesCount(times.length);
            return day.render();
        });

        return (
            <div className={'calendar-container'}>
                <div className={'calendar-header'}>
                    <h2 className={'calendar-header-left'}>
                        {monthNames[date.getMonth()]} {date.getFullYear()}
                    </h2>
                    <div className={'calendar-header-right'}>
                        <button className={'btn-new-event'}>new event</button>
                    </div>
                </div>
                <div className={'calendar'} id={'calendar'}>
                    <div className={'calendar-column column-time'}>
                        <div className={'column-header column-time-header'}/>
                        <div className={'container-times'}>
                            {times}
                        </div>
                    </div>
                    {columns}
                </div>
            </div>
        );
    }
}

export default Calendar;
