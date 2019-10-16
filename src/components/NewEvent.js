import React, {Component} from 'react';
import '../css/NewEvent.css';

class NewEvent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventName: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    render() {
        return (
            <div className={'create-new-event'}>
                HELLO THERE
                {/*<input className={'input-event-name'} type={'text'} name={'eventName'} placeholder={'new event'} value={this.state.fullname} onChange={this.handleChange}/>*/}
            </div>
        );
    }
}

export default NewEvent;
