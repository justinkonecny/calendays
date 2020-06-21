import React, {Component} from 'react';
import '../../css/common/Dropdown.scss';
import {NetworkGroup} from '../../data/NetworkGroup';

interface DropdownNetworkProps {
    networkList: NetworkGroup[];
    direction: string;
    setEventNetwork: (network: NetworkGroup) => void;
}

interface DropdownNetworkState {
    showPicker: boolean;
    selection: NetworkGroup | null;
}

export class DropdownNetwork extends Component<DropdownNetworkProps, DropdownNetworkState> {

    constructor(props: DropdownNetworkProps) {
        super(props);

        this.clickDropdown = this.clickDropdown.bind(this);
        this.clickNetwork = this.clickNetwork.bind(this);

        this.state = {
            selection: this.props.networkList.length > 0 ? this.props.networkList[0] : null,
            showPicker: false
        }
    }

    componentDidMount() {
        if (this.props.networkList.length > 0) {
            this.props.setEventNetwork(this.props.networkList[0]);
        }
    }

    clickDropdown() {
        this.setState({showPicker: !this.state.showPicker});
    }

    clickNetwork(event: React.MouseEvent<HTMLElement>) {
        const networkIndex = parseInt(event.currentTarget.id.split('-')[1]);

        this.setState({
            showPicker: false,
            selection: this.props.networkList[networkIndex]
        });

        this.props.setEventNetwork(this.props.networkList[networkIndex]);
    }

    render() {
        if (this.props.networkList.length === 0) {
            return (
                <h4>No Networks Found!</h4>
            );
        }


        return (
            <div className={this.props.direction === 'top' ? 'dropdown-container container-top' : 'dropdown-container'}>
                <button className={'btn-date-time'} onClick={this.clickDropdown}>
                    <div className={'flex'}>
                        <p className={'net-name'}>{this.state.selection?.getName()}</p>
                        <div className={'picker-color my-auto'} style={{backgroundColor: this.state.selection?.getColorHex()}}/>
                    </div>

                </button>
                {this.state.showPicker && <div className={this.props.direction === 'top' ? 'picker picker-top shadow' : 'picker shadow'}>
                    {this.props.networkList.map((network: NetworkGroup, index: number) => {
                        return (
                            <button id={'ng-' + index} className={'picker-inner'} onClick={this.clickNetwork} key={index} >
                                <div className={'flex'}>
                                    <p className={'net-name'}>{network.getName()}</p>
                                    <div className={'picker-color my-auto'} style={{backgroundColor: network.getColorHex()}}/>
                                </div>
                            </button>
                        );
                    })}</div>}
            </div>
        );
    }
}
