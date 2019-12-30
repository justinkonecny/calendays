import React, {Component} from 'react';
import '../../css/InputField.scss';

class InputField extends Component {
    render() {
        const divClass = this.props.className ? 'input-container ' + this.props.className :  'input-container';
        return (
            <div className={divClass}>
                <input className={'input-animated'}
                       type={this.props.type}
                       name={this.props.name}
                       value={this.props.value}
                       placeholder={this.props.placeholder}
                       onChange={this.props.onChange}/>
                <span className={'input-border'}/>
                {/*<label className={'label-animated'}>{this.props.placeholder}</label>*/}
            </div>
        );
    }
}

export default InputField;
