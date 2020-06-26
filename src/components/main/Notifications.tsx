import React, {Component} from 'react';
import {NetworkEvent} from '../../data/NetworkEvent';
import '../../css/main/Notifications.scss'
import {NetworkGroup} from '../../data/NetworkGroup';
import {MonthNames, WeekDayNames} from './Constants';

interface NotificationsProps {
    events: NetworkEvent[] | null;
    networks: NetworkGroup[] | null;
}

interface NotificationsState {
    eventBlocks: any;
    eventDetails: Map<Number, NetworkEvent>;
    selectionId: number;
}

export class Notifications extends Component<NotificationsProps, NotificationsState> {

    constructor(props: NotificationsProps) {
        super(props);

        this.renderEvents = this.renderEvents.bind(this);
        this.clickNotification = this.clickNotification.bind(this);

        this.state = {
            eventBlocks: [],
            eventDetails: new Map<Number, NetworkEvent>(),
            selectionId: -1
        }
    }

    getFormattedTime(date: Date) {
        const hours = (date.getHours() + 11) % 12 + 1;
        const suffix = date.getHours() >= 12 ? 'PM' : 'AM';
        return hours.toString() + ':' + date.getMinutes().toString().padStart(2, '0') + ' ' + suffix;
    }

    clickNotification(event: React.MouseEvent<HTMLElement>) {
        const selectionId = parseInt(event.currentTarget.id.split('-')[1]);
        this.setState({selectionId});
    }

    renderEvents() {
        if (this.props.events === null || this.props.networks === null) {
            return;
        }

        const eventDetails = new Map<Number, NetworkEvent>();
        const eventBlocks = [];

        for (const event of this.props.events) {
            if (event.getStartDate() < new Date()) {
                // Only show upcoming events
                continue;
            }

            let network = null;
            let color = '#f48a84';
            if (this.props.networks !== null) {
                for (const group of this.props.networks) {
                    if (group.getId() === event.getNetworkId()) {
                        network = group;
                        if (group.getColorHex()) {
                            color = group.getColorHex();
                        }
                        break;
                    }
                }
            }

            const eventBlock = (
                <div id={'notification-' + event.getId()} className={'event-notification'} key={event.getId()} onClick={this.clickNotification} style={{borderColor: color}}>
                    <p className={'title'}>
                        {event.getName()}
                    </p>
                    <div className={'flex'}>
                        <p className={'notification'}>
                            {WeekDayNames[event.getStartDate().getDay()][0]}, {MonthNames[event.getStartDate().getMonth()]} {event.getStartDate().getDate()}<br/>
                            {this.getFormattedTime(event.getStartDate())} - {this.getFormattedTime(event.getEndDate())}
                        </p>
                        <p className={'network'}>
                            {network?.getName()}
                        </p>
                    </div>
                </div>
            );

            eventBlocks.push(eventBlock);
            eventDetails.set(event.getId(), event);
        }

        let selectionId = this.state.selectionId;
        if (eventBlocks.length > 0 && eventBlocks[0].key) {
            selectionId = parseInt(eventBlocks[0].key.toString());
        }

        this.setState({
            eventBlocks,
            eventDetails,
            selectionId
        });
    }

    componentDidMount() {
        this.renderEvents();
    }

    componentDidUpdate(prevProps: Readonly<NotificationsProps>, prevState: Readonly<NotificationsState>, snapshot?: any) {
        if (this.props.events !== prevProps.events || this.props.networks !== prevProps.networks) {
            this.renderEvents();
        }
    }

    render() {
        let leftSide;
        let rightSide;
        if (this.state.eventBlocks.length > 0) {
            const selectedEvent = this.state.eventDetails.get(this.state.selectionId);

            if (!selectedEvent) {
                leftSide = (<>
                    <h2>notifications</h2>
                    <p className={'no-events'}>no upcoming events!</p>
                </>);
                rightSide = null;
            } else {
                leftSide = (<>
                    <h2>notifications</h2>
                    {this.state.eventBlocks}
                </>);
                rightSide = (<>
                    <h2 className={'event-title'}>{selectedEvent?.getName()}</h2>

                    <h3>date + time</h3>
                    <p>
                        {WeekDayNames[selectedEvent.getStartDate().getDay()][0]}, {MonthNames[selectedEvent.getStartDate().getMonth()]} {selectedEvent.getStartDate().getDate()}<br/>
                        {this.getFormattedTime(selectedEvent.getStartDate())} - {this.getFormattedTime(selectedEvent.getEndDate())}
                    </p>

                    <h3>message</h3>
                    <p>{selectedEvent.getMessage()}</p>

                    <h3>location</h3>
                    <p>{selectedEvent.getLocation()}</p>
                </>);
            }
        } else {
            leftSide = (<>
                <h2>notifications</h2>
                <p className={'no-events'}>no upcoming events!</p>
            </>);
            rightSide = null;
        }

        return (
            <div className={'page-notifications'}>
                <div className={'left'}>
                    {leftSide}
                </div>
                <div className={'right'}>
                    {rightSide}
                </div>
            </div>
        );
    }
}
