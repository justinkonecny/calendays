import React, {Component} from 'react';
import {ColumnPos, TimeOfDay, WeekDayNames} from '../main/Constants';

export class CalendarDay {
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

    getColumnClass() {
        return this.columnPos == null ? 'calendar-column' : 'calendar-column ' + this.columnPos;
    }

    getHeaderComponent(showNewEvent) {
        return (
            <Header key={this.dateDay}
                    columnPos={this.columnPos}
                    showNewEvent={showNewEvent}
                    isToday={this.isToday}
                    displayName={this.displayName}
                    dateDay={this.dateDay}
                    name={this.name}/>
        );
    }

    getDayComponent(showNewEvent) {
        return (
            <Day key={this.dateDay}
                 columnPos={this.columnPos}
                 showNewEvent={showNewEvent}
                 timesCount={this.timesCount}
                 events={this.events}
                 name={this.name}/>
        );
    }

    getComponent(showNewEvent) {
        // TODO: Fix ids and keys
        const columnClass = this.columnPos == null ? 'calendar-column' : 'calendar-column ' + this.columnPos;
        return (
            <div className={columnClass} id={this.name} key={this.name}>
                <Header key={this.dateDay}
                        columnPos={this.columnPos}
                        showNewEvent={showNewEvent}
                        isToday={this.isToday}
                        displayName={this.displayName}
                        dateDay={this.dateDay}
                        name={this.name}/>
                <Day key={this.dateDay}
                     columnPos={this.columnPos}
                     showNewEvent={showNewEvent}
                     timesCount={this.timesCount}
                     events={this.events}
                     name={this.name}/>
            </div>
        );
    }

}

class Header extends Component {
    render() {
        let weekdayClass = this.props.isToday ? 'weekday column-header-today' : 'weekday';
        weekdayClass = this.props.showNewEvent ? weekdayClass + ' weekday-half' : weekdayClass;

        let dayClass = this.props.isToday ? 'day column-header-today' : 'day';
        dayClass = this.props.showNewEvent ? dayClass + ' day-half' : dayClass;

        let columnHeaderClass = this.props.isToday ? 'column-header column-header-today' : 'column-header';
        columnHeaderClass = this.props.showNewEvent ? columnHeaderClass + ' column-header-half' : columnHeaderClass;
        columnHeaderClass = this.props.columnPos == null ? columnHeaderClass + ' calendar-column' : columnHeaderClass + ' calendar-column ' + this.props.columnPos;

        return (
            <div className={columnHeaderClass}>
                <div className={weekdayClass}>
                    {this.props.displayName}
                </div>
                <div className={dayClass}>
                    {this.props.dateDay}
                </div>
            </div>
        );
    }
}

class Day extends Component {
    render() {
        const renderedEvents = this.props.events.map(event => {
            const hour = parseInt(event.time.hour);
            const duration = parseInt(event.duration.hours) + (parseInt(event.duration.minutes) / 60);

            const eventStyle = {
                height: 'calc((' + (100 / this.props.timesCount) + '% - 2px) * ' + duration + ' - 8px)'
            };

            if (event.time.timeOfDay === TimeOfDay.AM) {
                eventStyle.top = 'calc(' + ((hour) * (100 / this.props.timesCount)) + '% + 2px)';
            } else {
                eventStyle.top = 'calc(' + ((hour + 12) * (100 / this.props.timesCount)) + '% + 2px)';
            }

            return (
                // TODO: Change key to unique value
                <div className={'calendar-event'} style={eventStyle} key={event.name}>
                    <h5>{event.name}</h5>
                    <div className={'event-description'}>
                        <p>{event.location}</p>
                        {/*<p>{event.message}</p>*/}
                    </div>
                </div>
            );
        });

        const rowHeightStyle = {height: 'calc(' + (100 / this.props.timesCount) + '% - 2px)'};
        const columnGrid = [];
        for (let i = 0; i < 24; i++) {
            let className = this.props.columnPos === ColumnPos.LEFT ? 'row-grid calendar-column row-left' : 'row-grid calendar-column';
            if (i === 23) {
                if (this.props.columnPos === ColumnPos.RIGHT) {
                    className += ' row-bottom row-bottom-right';
                } else if (this.props.columnPos === ColumnPos.LEFT) {
                    className += ' row-bottom row-bottom-left';
                } else {
                    className += ' row-bottom';
                }
            }
            columnGrid.push(
                <div className={className} style={rowHeightStyle} key={'row' + i}/>
            );
        }

        return (
            <div className={'container-events'}>
                {renderedEvents}
                {columnGrid}
            </div>
        );
    }
}
