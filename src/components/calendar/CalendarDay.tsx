import React, {Component} from 'react';
import {ColumnPos, WeekDayNames} from '../main/Constants';
import {NetworkGroup} from '../../data/NetworkGroup';
import {NetworkEvent} from '../../data/NetworkEvent';

export class CalendarDay {

    private weekDay: string[];
    private name: string;
    private displayName: string;
    private columnPos: string;
    private isToday: boolean;
    private dateMonth: number;
    private dateDay: number;
    private date: Date;
    private events: any[];
    private timesCount: number;
    private networkGroups: NetworkGroup[] | null;

    constructor(weekDayIndex: number, columnPos: string) {
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
        this.timesCount = -1; // TODO FIX?
        this.networkGroups = null;
    }

    setNetworkGroups(groups: NetworkGroup[]) {
        this.networkGroups = groups;
    }

    setDate(date: Date) {
        this.date = date;
        this.dateMonth = date.getMonth();
        this.dateDay = date.getDate();
        return this;
    }

    setDayMonth(num: number) {
        this.dateDay = num;
        return this;
    }

    setTimesCount(count: number) {
        this.timesCount = count;
        return this;
    }

    setToday(bool: boolean) {
        this.isToday = bool;
        return this;
    }

    renderEvent(event: any) {
        this.events.push(event);
    }

    getDate() {
        return this.date;
    }

    getColumnClass() {
        return this.columnPos == null ? 'calendar-column' : 'calendar-column ' + this.columnPos;
    }

    getHeaderComponent(showNewEvent: boolean) {
        return (
            <Header key={this.dateDay}
                    columnPos={this.columnPos}
                    showNewEvent={showNewEvent}
                    isToday={this.isToday}
                    displayName={this.displayName}
                    dateDay={this.dateDay}
            />
        );
    }

    getDayComponent(personalNetworkId: number, showSharedEvents: boolean) {
        return (
            <Day key={this.dateDay}
                 columnPos={this.columnPos}
                 timesCount={this.timesCount}
                 events={this.events}
                 networkGroups={this.networkGroups}
                 personalNetworkId={personalNetworkId}
                 showSharedEvents={showSharedEvents}
            />
        );
    }
}

interface HeaderProps {
    isToday: boolean;
    showNewEvent: boolean;
    columnPos: string;
    displayName: string;
    dateDay: number;
}

class Header extends Component<HeaderProps, {}> {
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

interface DayProps {
    events: null | NetworkEvent[];
    timesCount: number;
    columnPos: string;
    networkGroups: NetworkGroup[] | null;
    personalNetworkId: number;
    showSharedEvents: boolean;
}

class Day extends Component<DayProps, {}> {
    constructor(props: DayProps) {
        super(props);
        this.getRenderedEvent = this.getRenderedEvent.bind(this);
    }

    getRenderedEvent(event: NetworkEvent) {
        // TODO: Handle events that are on different days
        const durationHours = (event.getEndDate().getTime() - event.getStartDate().getTime()) / 1000.0 / 60.0 / 60.0;

        let color = '#f48a84';
        if (this.props.networkGroups !== null) {
            for (const group of this.props.networkGroups) {
                if (group.getId() === event.getNetworkId()) {
                    if (group.getColorHex()) {
                        color = group.getColorHex();
                    }
                    break;
                }
            }
        }

        const eventStyle: { [style: string]: any } = {
            height: 'calc((' + (100 / this.props.timesCount) + '%) * ' + durationHours + ' - 18px)',
            backgroundColor: color
        };

        eventStyle.top = 'calc(' + ((event.getStartDate().getHours()) * (100 / this.props.timesCount)) + '% + 2px)';

        return (
            <div className={'calendar-event'} style={eventStyle} key={event.getId()}>
                <h5>{event.getName()}</h5>
                <div className={'event-description'}>
                    <p>{event.getLocation()}</p>
                    {/*<p>{event.message}</p>*/}
                </div>
            </div>
        );
    }

    render() {
        let renderedEvents: any[] = [];
        if (this.props.networkGroups !== null && this.props.events !== null) {
            for (const event of this.props.events) {
                if (!this.props.showSharedEvents && event.getNetworkId() !== this.props.personalNetworkId) {
                    continue;
                }
                renderedEvents.push(this.getRenderedEvent(event));
            }
        }

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
