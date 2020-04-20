import React, {Component} from 'react';
import '../../css/main/NavBar.scss';
import home from "../../resources/home.svg";
import notification from "../../resources/notification.svg";
import profile from "../../resources/profile.svg";
import {MonthNames} from "./Constants";

interface NavBarProps {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export class NavBar extends Component<NavBarProps, {}> {
    render() {
        const date = new Date();  // The current date to render at bottom of side nav

        return (
            <div className={'navbar'}>
                <div className={'nav-btn-container'}>
                    <div className={'nav-icon'}>
                        <button id={'nav-btn-home'} className={'btn-invisible btn-nav'} onClick={this.props.onClick}>
                            <img id={'icon-home'} className={'logo'} src={home} alt={'home'}/>
                        </button>
                    </div>
                    <div className={'nav-icon'}>
                        <button id={'nav-btn-notifications'} className={'btn-invisible btn-nav'} onClick={this.props.onClick}>
                            <img className={'logo'} src={notification} alt={'notification'}/>
                        </button>
                    </div>
                    <div className={'nav-icon'}>
                        <button id={'nav-btn-user'} className={'btn-invisible btn-nav'} onClick={this.props.onClick}>
                            <img id={'icon-user'} className={'logo'} src={profile} alt={'profile'}/>
                        </button>
                    </div>
                </div>
                <div className={'nav-today-container'}>

                    <div className={'nav-today-header'}>
                        <div className={'flex-centered'}>
                            today
                        </div>
                    </div>

                    <div className={'nav-date-container'}>
                        <div className={'flex-centered'}>
                            <div className={'nav-month'}>
                                {MonthNames[date.getMonth()].substring(0, 3).toUpperCase()}
                            </div>
                            <div className={'nav-day'}>
                                {date.getDate()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
