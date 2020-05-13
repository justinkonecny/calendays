import React, {Component} from 'react';
import '../../css/common/Dropdown.scss';
import {NetworkGroup} from '../../data/NetworkGroup';

interface DropdownNetworkProps {
    networkList: NetworkGroup[];
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
            <div className={'dropdown-container'}>
                <button className={'btn-date-time'} onClick={this.clickDropdown} style={{color: this.state.selection?.getColor()}}>
                    {this.state.selection?.getName()}
                </button>
                {this.state.showPicker && <div className={'picker'}>
                    {this.props.networkList.map((network: NetworkGroup, index: number) => {
                        return (
                            <button id={'ng-' + index} className={'picker-inner'} onClick={this.clickNetwork} key={index} style={{color: network.getColor()}}>
                                {network.getName()}
                            </button>
                        );
                    })}
                </div>
                }
            </div>
        );
    }
}
