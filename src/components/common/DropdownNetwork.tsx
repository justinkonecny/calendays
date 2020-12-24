import React, {Component} from 'react';
import '../../css/common/Dropdown.scss';
import {NetworkGroup} from '../../data/NetworkGroup';

interface DropdownNetworkProps {
    networkList: NetworkGroup[];
    direction: string;
    setEventNetwork: (network: NetworkGroup) => void;
    type?: string;
    width?: string;
    style?: object;
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
        if (this.props.networkList?.length > 0) {
            this.props.setEventNetwork(this.props.networkList[0]);
        }
    }

    componentDidUpdate(prevProps: Readonly<DropdownNetworkProps>, prevState: Readonly<DropdownNetworkState>, snapshot?: any): void {
        if (this.props.networkList?.length > 0 && this.state.selection == null) {
            this.props.setEventNetwork(this.props.networkList[0]);
            this.setState({selection: this.props.networkList[0]});
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

        let btnDropdownClass = 'btn-dropdown';
        let pickerClass = this.props.direction === 'top' ? 'picker picker-top' : 'picker';
        const nameStyle: { [key: string]: string } = {fontSize: '14pt'};

        if (this.props.type === 'ghost') {
            btnDropdownClass += ' btn-ghost';
            nameStyle.fontWeight = '600';
        } else {
            pickerClass += ' shadow';
        }

        const pickerWidth = this.props.width || '210pt';
        const arrowClass = this.state.showPicker ? 'arrow arrow-open' : 'arrow';

        return (
            <div className={this.props.direction === 'top' ? 'dropdown-container container-top' : 'dropdown-container'}
                 style={this.props.style}>
                <button className={btnDropdownClass} onClick={this.clickDropdown} style={{width: pickerWidth}}>
                    <div className={'flex-container'}>
                        <p className={'net-name'} style={nameStyle}>
                            {this.state.selection?.getName()}
                        </p>
                        <div className={'picker-color my-auto'}
                             style={{backgroundColor: this.state.selection?.getColorHex()}}/>
                        <div className={arrowClass}/>
                    </div>

                </button>
                {this.state.showPicker && <div className={pickerClass}
                                               style={{width: pickerWidth}}>
                    {this.props.networkList.map((network: NetworkGroup, index: number) => {
                        return (
                            <button id={'ng-' + index} className={'picker-inner'} onClick={this.clickNetwork}
                                    key={index}>
                                <div className={'flex'}>
                                    <p className={'net-name'}>
                                        {network.getName()}
                                    </p>
                                    <div className={'picker-color my-auto'}
                                         style={{backgroundColor: network.getColorHex()}}/>
                                </div>
                            </button>
                        );
                    })}</div>}
            </div>
        );
    }
}
