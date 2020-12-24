import React, {Component} from 'react';
import {NewEvent} from './NewEvent';
import '../../css/calendar/Calendar.scss'
import {CalendarDay} from './CalendarDay';
import {CalendarTab, ColumnPos, MonthNames} from '../main/Constants';
import {UserProfile} from '../../data/UserProfile';
import {NetworkGroup} from '../../data/NetworkGroup';
import {NetworkEvent} from '../../data/NetworkEvent';
import {DropdownNetwork} from '../common/DropdownNetwork';


interface CalendarProps {
    handleNewEvent: (event: any) => void;
    userProfile: null | UserProfile;
    events: null | NetworkEvent[];
    networkGroups: NetworkGroup[];
    page: string;
    showSharedEvents: boolean;
    personalNetworkId: number;
}

interface CalendarState {
    events: null | NetworkEvent[];
    dayClasses: CalendarDay[];
    showNewEvent: boolean;
    displayedWeek: number;
    displayedDate: Date;
    currentNetwork: null | NetworkGroup;
    displayedNetworkId: null | number;
    currentTab: string;
    timesCount: number;
}

export class Calendar extends Component<CalendarProps, CalendarState> {
    private readonly date: Date;
    private readonly monthLengths: number[];
    private readonly times: JSX.Element[];

    constructor(props: CalendarProps) {
        super(props);

        this.renderEventsForWeek = this.renderEventsForWeek.bind(this);
        this.getPopulatedDates = this.getPopulatedDates.bind(this);
        this.toggleNewEvent = this.toggleNewEvent.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleFailure = this.handleFailure.bind(this);
        this.showNextWeek = this.showNextWeek.bind(this);
        this.showPrevWeek = this.showPrevWeek.bind(this);
        this.setNetworkGroup = this.setNetworkGroup.bind(this);
        this.setTab = this.setTab.bind(this);

        this.date = new Date();  // Today's dateDay

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

        this.monthLengths = [];  // The number of days in each dateMonth (by index)
        for (let i = 1; i <= 12; i++) {
            const lastDate = new Date(this.date.getFullYear(), i, 0);
            this.monthLengths.push(lastDate.getDate());
        }

        const dayDate = this.date.getDate();
        const weekIndex = this.date.getDay();
        firstWeek[weekIndex].setDayMonth(dayDate).setToday(true);  // Sets this dateDay as 'today'

        // const timesCount = window.innerHeight > 1800 ? 20 : 11;
        const timesCount = Math.max(Math.round(window.innerHeight / 90), 10);

        this.state = {
            events: null,
            dayClasses: firstWeek,  // The list of Calendar days
            showNewEvent: false,  // Don't show the new event creator after load
            displayedWeek: 0,  // Index of first day of the week being displayed
            displayedDate: this.date,  // Date of first day of the week being displayed
            currentNetwork: null,
            displayedNetworkId: null,
            currentTab: CalendarTab.SHARED_CALENDAR,
            timesCount: timesCount
        };

        this.state = {
            ...this.state,
            dayClasses: this.getPopulatedDates(this.date, 0),
            displayedDate: this.state.dayClasses[0].getDate()
        };

        const timesTemp: string[] = [];  // List of times displayed on the side of the calendar
        for (let i = 0; i < 24; i++) {
            if (i === 0) {
                timesTemp.push('');
            } else if (i === 12) {
                timesTemp.push('12 pm');
            } else if (i > 12) {
                timesTemp.push((i - 12) + ' pm');
            } else {
                timesTemp.push(i + ' am');
            }
        }

        const rowHeight = {height: 'calc(' + (100 / this.state.timesCount) + '% - 2pt)'};  // Height of each row in the calendar
        this.times = timesTemp.map(time => {
            const idArr = time.split(' ');
            const id = idArr[0] + idArr[1];
            return (
                <div id={id} className={'row-time'} style={rowHeight} key={'rowTime' + time.replace(' ', '_')}>
                    <span className={'time'}>{time}</span>
                </div>
            );
        });
    }

    componentDidUpdate(prevProps: CalendarProps, prevState: CalendarState, snapshot: any) {
        if (prevProps.events == null && this.props.events != null) {
            // If the query returns and we now have an event list
            this.setState({events: this.props.events.slice()});
        } else if (prevState.events == null && this.state.events != null) {
            // If we're rendering events for the first time
            this.renderEventsForWeek(0);
        }
    }

    componentDidMount() {
        const noon = document.getElementById('12pm');
        if (noon !== null) {
            noon.scrollIntoView({block: 'center'});
        }
        if (this.props.events != null && this.state.events == null) {
            this.setState({events: this.props.events.slice()});
        }
    }

    getPopulatedDates(theDate: Date, startOffset: number) {
        const currDate = theDate.getDate();
        const currDayOfWeek = theDate.getDay();
        if (isNaN(currDate) || isNaN(currDayOfWeek)) {
            // TODO: Show error to the user
        }

        const populatedDays: CalendarDay[] = this.state.dayClasses;
        if (startOffset >= populatedDays.length) {
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

    handleSuccess(event: any) {
        let events = this.state.events;
        if (events === null) {
            events = [];
        }
        events.push(event);
        this.setState({showNewEvent: false, events});
        this.renderEventsForWeek(this.state.displayedWeek);
        this.props.handleNewEvent(event);
    }

    handleFailure(error: any) {
        console.error('Error creating event');
        console.error(error);
    }

    renderEventsForWeek(displayedWeek: number) {
        if (this.state.events === null) {
            return;  // TODO Remove this statement?
        }
        const events = this.state.events;
        const toRemove = [];

        const weekStartDate = this.state.displayedDate;
        weekStartDate.setHours(0, 0, 0, 0);

        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekStartDate.getDate() + 7);

        for (let i = 0; i < events.length; i++) {
            const event: NetworkEvent = events[i];

            if (event.getStartDate() < weekEndDate
                && event.getStartDate() >= weekStartDate) {
                // Match has been found
                toRemove.push(i);  // Add this event's index to the list to remove the event

                const eventDayOfWeek = event.getStartDate().getDay();
                const eventIndex = eventDayOfWeek + displayedWeek;

                this.state.dayClasses[eventIndex].renderEvent(event);
                this.state.dayClasses[eventIndex].setNetworkGroups(this.props.networkGroups);
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

    setNetworkGroup(network: NetworkGroup) {
        console.log('(CM01) Setting NetworkGroup (', network.getId(), '):', network.getName());
        this.setState({displayedNetworkId: network.getId()});
    }

    setTab(event: React.MouseEvent) {
        const target = event.currentTarget.id;
        if (target === this.state.currentTab) {
            return;
        }

        if (target === CalendarTab.SHARED_CALENDAR) {
            this.setState({
                currentTab: CalendarTab.SHARED_CALENDAR,
                displayedNetworkId: null
            });
        } else if (target === CalendarTab.MY_CALENDAR) {
            this.setState({
                currentTab: CalendarTab.MY_CALENDAR,
                displayedNetworkId: this.props.personalNetworkId
            });
        }
    }

    render() {
        const columnBodies: JSX.Element[] = [];
        const columnHeaders = this.state.dayClasses.slice(this.state.displayedWeek, this.state.displayedWeek + 7).map(day => {
            day.setTimesCount(this.state.timesCount);
            columnBodies.push(day.getDayComponent(this.state.displayedNetworkId));
            return day.getHeaderComponent(this.state.showNewEvent);
        });

        let tabSharedClass = 'btn-flat';
        let tabPersonalClass = 'btn-flat';

        if (this.state.currentTab === CalendarTab.SHARED_CALENDAR) {
            tabSharedClass += ' btn-flat-active';
        } else if (this.state.currentTab === CalendarTab.MY_CALENDAR) {
            tabPersonalClass += ' btn-flat-active';
        }

        return (
            <div className={'cal-container-outer'}>
                <div className={'actions-container'}>
                    <div className={'cal-view-btns'}>
                        <button id={'cal-tab-shared'} className={tabSharedClass} onClick={this.setTab}>
                            shared calendar
                        </button>
                        <button id={'cal-tab-personal'} className={tabPersonalClass} onClick={this.setTab}>
                            my calendar
                        </button>
                        <div className={'line'}/>
                    </div>

                    <div className={'actions-inner'}>
                        <div className={'actions-right'}>

                            {this.state.currentTab === CalendarTab.SHARED_CALENDAR
                            && <DropdownNetwork networkList={this.props.networkGroups}
                                                setEventNetwork={this.setNetworkGroup}
                                                direction={'bottom'}
                                                type={'ghost'}
                                                width={'250pt'}/>}
                        </div>
                        <div className={'actions-right'}>
                            <button className={'btn-primary btn-new-event'} onClick={this.toggleNewEvent}>
                                create event
                            </button>
                        </div>
                    </div>
                </div>


                <div className={'cal-container-inner'}>
                    {this.state.showNewEvent && <NewEvent userProfile={this.props.userProfile}
                                                          handleSuccess={this.handleSuccess}
                                                          handleFailure={this.handleFailure}
                                                          monthLengths={this.monthLengths}
                                                          networkGroups={this.props.networkGroups}/>}
                    <div
                        className={this.state.showNewEvent ? 'calendar-container calendar-container-half' : 'calendar-container'}>
                        <div className={'calendar-header'}>
                            <button className={'left-arrow'} onClick={this.showPrevWeek}/>
                            <h1 className={this.state.showNewEvent ? 'calendar-header-left calendar-header-left-half' : 'calendar-header-left'}>
                                {MonthNames[this.state.displayedDate.getMonth()]} {this.state.displayedDate.getFullYear()}
                            </h1>
                            <div className={'calendar-header-right'}>
                                {/*<button className={'btn-primary btn-new-event'} onClick={this.toggleNewEvent}>create event</button>*/}
                            </div>
                            <button className={this.state.showNewEvent ? 'right-arrow right-arrow-half' : 'right-arrow'}
                                    onClick={this.showNextWeek}/>
                        </div>
                        <div className={'calendar'} id={'calendar'}>
                            <div style={{width: '100%', display: 'flex'}}>
                                <div className={'column-header column-time-header'}/>
                                {columnHeaders}
                            </div>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                height: 'calc(100% - 100pt)',
                                overflow: 'scroll'
                            }}>
                                <div className={'container-times'}>
                                    {this.times}
                                </div>
                                {columnBodies}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
