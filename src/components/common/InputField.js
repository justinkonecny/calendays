import React, {Component} from 'react';
import '../../css/common/InputField.scss';

class InputField extends Component {
    render() {
        const divClass = this.props.className ? 'input-container ' + this.props.className : 'input-container';
        const autocomplete = this.props.autocomplete || 'off';
        const inputClass = this.props.isInvalid ? 'input-animated input-invalid' : 'input-animated';
        const showInvalidText = this.props.invalidText && this.props.isInvalid;
        return (
            <div className={'input-outer-container'}>
                <div className={divClass}>
                    <input className={inputClass}
                           type={this.props.type}
                           name={this.props.name}
                           value={this.props.value}
                           placeholder={this.props.placeholder}
                           onChange={this.props.onChange}
                           autoComplete={autocomplete}
                           onKeyDown={this.props.onKeyDown}/>
                    <span className={'input-border'}/>
                    {/*<label className={'label-animated'}>{this.props.placeholder}</label>*/}
                </div>
                {showInvalidText && <p className={'input-invalid-text'}>{this.props.invalidText}</p>}
            </div>
        );
    }
}

export default InputField;
