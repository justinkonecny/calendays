import React, {Component} from 'react';
import {NetworkEvent} from '../../data/NetworkEvent';
import '../../css/main/Notifications.scss'
import {NetworkGroup} from '../../data/NetworkGroup';

interface NotificationsProps {
    events: NetworkEvent[] | null;
    networks: NetworkGroup[] | null;
}

interface NotificationsState {
    eventBlocks: any;
}

export class Notifications extends Component<NotificationsProps, NotificationsState> {

    constructor(props: NotificationsProps) {
        super(props);

        this.state = {
            eventBlocks: []
        }
    }

    componentDidMount() {
        if (this.props.events !== null) {
            const eventBlocks = this.props.events?.map((event) => {
                let color = '#f48a84';
                if (this.props.networks !== null) {
                    for (const group of this.props.networks) {
                        if (group.getId() === event.getNetworkId()) {
                            if (group.getColorHex()) {
                                color = group.getColorHex();
                            }
                            break;
                        }
                    }
                }

                return (
                    <div className={'event-notification'} key={event.getId()} style={{borderColor: color}}>
                        <p className={'title'}>
                            {event.getName()}
                        </p>
                    </div>
                )
            });
            this.setState({eventBlocks});
        }
    }

    render() {
        return (
            <div className={'flex'}>
                <div>
                    {this.state.eventBlocks}
                </div>
                <div>
                    Right Side
                </div>
            </div>
        );
    }
}
