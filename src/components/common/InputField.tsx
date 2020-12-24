import React, {Component} from 'react';
import '../../css/common/InputField.scss';

interface InputFieldProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    autocomplete?: string;
    invalidText?: string;
    className?: string;
    isInvalid?: boolean;
    placeholder: string;
    value: string;
    type: string;
    name: string;
}

class InputField extends Component<InputFieldProps, {}> {
    render() {
        const divClass = this.props.className ? 'input-container ' + this.props.className : 'input-container';
        const autocomplete = this.props.autocomplete || 'off';
        const inputClass = this.props.isInvalid ? 'input-animated input-invalid' : 'input-animated';
        const labelClass = this.props.isInvalid ? 'label-animated label-invalid' : 'label-animated';
        const showInvalidText = this.props.invalidText && this.props.isInvalid;
        return (
            <div className={'input-outer-container'}>
                <div className={divClass}>
                    <input required={true}
                           className={inputClass}
                           type={this.props.type}
                           name={this.props.name}
                           value={this.props.value}
                        // placeholder={this.props.placeholder}
                           onChange={this.props.onChange}
                           autoComplete={autocomplete}
                           onKeyDown={this.props.onKeyDown}/>
                    <span className={'input-border'}/>
                    <label className={labelClass}>{this.props.placeholder}</label>
                </div>
                {showInvalidText && <p className={'input-invalid-text'}>{this.props.invalidText}</p>}
            </div>
        );
    }
}

export default InputField;
