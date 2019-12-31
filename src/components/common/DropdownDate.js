import React, {Component} from 'react';
import '../../css/common/Dropdown.scss';

class DropdownDate extends Component {
    constructor(props) {
        super(props);
        this.dates = [];
        this.monthLengths = this.props.monthLengths;
        this.startDate = this.props.startDate;
        this.displayDate = this.startDate;
        this.weekDays = this.props.weekDays;
        this.months = this.props.months;
        this.setDate = this.props.setDate;
        this.length = this.props.length;
        this.state = {
            showPicker: false
        };

        this.clickEventDate = this.clickEventDate.bind(this);
        this.clickDate = this.clickDate.bind(this);

        const firstDate = this.startDate.getDate();
        for (let i = 0; i < this.length; i++) {
            const newDate = new Date(this.startDate);
            newDate.setDate(firstDate + i);
            this.dates.push(newDate);
        }
    }

    clickEventDate() {
        const showing = this.state.showPicker;
        this.setState({showPicker: !showing});
    }

    clickDate(event) {
        const fullDate = event.target.innerText;
        const split = fullDate.indexOf(' ') + 1; // Get index to separate weekday from date
        const dateStr = fullDate.substring(split); // Get the date without the weekday
        const date = new Date(dateStr);

        this.setState({showPicker: false});
        this.displayDate = date;
        this.setDate(date);
    }

    render() {
        return (
            <div className={'date-time'}>
                <button className={'btn-date-time'} onClick={this.clickEventDate}>
                    {this.weekDays[this.displayDate.getDay()][1]}. {this.months[this.displayDate.getMonth()]} {this.displayDate.getDate()} {this.displayDate.getFullYear()}
                </button>
                {this.state.showPicker && <div className={'picker'}>
                    {this.dates.map(date => {
                        return (
                            <button className={'picker-inner'} onClick={this.clickDate} key={date}>
                                {this.weekDays[date.getDay()][1]}. {this.months[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear()}
                            </button>
                        );
                    })}
                </div>}
            </div>
        );
    }
}

export default DropdownDate;
