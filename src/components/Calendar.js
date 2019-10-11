import React, {Component} from 'react';
import '../css/Calendar.css'

class Day {

    constructor(name, displayName) {
        this.name = name;
        this.displayName = displayName;
        this.dayMonth = -1;
    }

    setDayMonth(num) {
        this.dayMonth = num;
    }

    render() {
        return (
            <div className={'calendar-column'} id={this.name}>
                <div className={'column-header'}>
                    <div className={'weekday'}>
                        {this.displayName}
                    </div>
                    <div className={'day'}>
                        {this.dayMonth}
                    </div>
                </div>
            </div>
        );
    }
}

class Calendar extends Component {

    constructor(props) {
        super(props);

        this.dayClasses = [
            new Day('Sunday', 'sun'),
            new Day('Monday', 'mon'),
            new Day('Tuesday', 'tues'),
            new Day('Wednesday', 'wed'),
            new Day('Thursday', 'thurs'),
            new Day('Friday', 'fri'),
            new Day('Saturday', 'sat'),
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

        this.dayClasses[dayOfWeek].setDayMonth(dayOfMonth);
        this.populateDates(dayOfMonth, dayOfWeek);

        const columns = this.dayClasses.map(day => {
            return day.render();
        });

        return (
            <div className={'calendar-container'}>
                <h2 className={'left-header'}>{monthNames[date.getMonth()]} {date.getFullYear()}</h2>
                <div className={'calendar'} id={'calendar'}>
                    <div className={'calendar-column column-time'}>
                        TIME
                    </div>
                    {columns}
                </div>
            </div>
        );
    }
}

export default Calendar;
