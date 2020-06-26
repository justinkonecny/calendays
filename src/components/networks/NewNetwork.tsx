import React, {Component} from 'react';
import '../../css/networks/NewNetwork.scss';
import InputField from '../common/InputField';
import {NetworkGroup} from '../../data/NetworkGroup';
import {UserProfile} from '../../data/UserProfile';
import {Api} from '../../api';
import {NetworkUser} from '../../data/NetworkUser';

interface NewNetworkProps {
    userProfile: UserProfile;
    handleFailure: (error: any) => void;
    handleSuccess: (networkGroup: NetworkGroup) => void;
}

interface NewNetworkState {
    netName: string;
    netColor: string;
    memberUsername: string;
    members: string[];
}

export class NewNetwork extends Component<NewNetworkProps, NewNetworkState> {
    constructor(props: NewNetworkProps) {
        super(props);

        this.state = {
            netName: '',
            netColor: '#F48A84',
            memberUsername: '',
            members: []
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitNetwork = this.submitNetwork.bind(this);
        this.addNetworkToUsers = this.addNetworkToUsers.bind(this);
        this.addMemberEmail = this.addMemberEmail.bind(this);
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const name: string = event.currentTarget.name;
        const value: string = event.currentTarget.value;
        this.setState((prevState: NewNetworkState) => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    async submitNetwork() {
        if (!this.props.userProfile) {
            console.error('(NNE01) User is not authenticated!');
            return;
        }
        if (this.state.netName === '') {
            console.error('(NNE02) Network must have a name!');
            return;
        }
        if (this.state.netColor === '') {
            console.error('(NNE03) Network must have a color!');
            return;
        }
        if (this.state.members.length === 0) {
            console.error('(NNE04) Network must have at least one other member!');
            return
        }

        const newNetwork = {
            ID: null,
            OwnerId: null,
            ColorHex: this.state.netColor,
            Name: this.state.netName,
            Members: this.state.members.map((username) => {
                return {
                    ID: null,
                    FirstName: null,
                    LastName: null,
                    Email: null,
                    Username: username
                }
            })
        };

        const response = await Api.createUserNetwork(newNetwork);
        if (response.status === 201 && response.data) {
            const n = response.data;
            const members = n.Members.map((m: any) => {
                return new NetworkUser(m.ID, m.FirstName, m.LastName, m.Email, m.Username);
            });
            const networkGroup = new NetworkGroup(n.ID, n.Name, n.OwnerId, n.ColorHex, members);
            console.log(`(NNS01): Successfully created new network '${n.Name}'!`);
            this.props.handleSuccess(networkGroup);
            // this.addNetworkToUsers(docRef.id, newNetwork);
        } else {
            console.error(`(NNE05): Failed to create new network '${newNetwork.Name}': ${response.status}!`);
            // this.props.handleFailure(error);
        }
    }

    addNetworkToUsers(networkId: string, network: NetworkGroup) {
        // TODO: Validate MemberIDs before adding network to user

        // for (const userId of network.getMembers()) {
        //     // First get the user's list of current networks
        //     this.props.db.collection(DbConstants.USERS)
        //         .doc(userId)
        //         .collection(DbConstants.NETWORKS).get()
        //         .then(col => {
        //             if (col.empty) {
        //                 // CASE: User has no networks yet, so create the first document
        //                 const newNetworksList = {[DbConstants.MEMBER_OF]: [{[networkId]: '#f48a84'}]};
        //                 this.props.db.collection(DbConstants.USERS)
        //                     .doc(userId)
        //                     .collection(DbConstants.NETWORKS)
        //                     .add(newNetworksList)
        //                     .then(docRef => {
        //                         if (userId === this.props.userProfile.getUid()) {
        //                             // this.props.handleSuccess(networkId);
        //                             // TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //                         }
        //                     })
        //                     .catch(error => {
        //                         console.error('Error adding network to user');
        //                         this.props.handleFailure(error);
        //                     });
        //             } else {
        //                 // CASE: User has a list of networks already, so update it
        //                 const doc = col.docs[0];
        //                 const networkList = doc.data()[DbConstants.MEMBER_OF];
        //                 networkList.push({[networkId]: '#f48a84'});
        //
        //                 const updatedNetworksList = {[DbConstants.MEMBER_OF]: networkList};
        //                 this.props.db.collection(DbConstants.USERS)
        //                     .doc(userId)
        //                     .collection(DbConstants.NETWORKS)
        //                     .doc(doc.id)
        //                     .update(updatedNetworksList)
        //                     .then(docRef => {
        //                         if (userId === this.props.userProfile.getUid()) {
        //                             this.props.handleSuccess(network);
        //                         }
        //                     })
        //                     .catch(error => {
        //                         console.error('Error adding network to user');
        //                         this.props.handleFailure(error);
        //                     });
        //             }
        //         })
        //         .catch(error => {
        //             console.error('Failed to get user networks');
        //             console.error(error);
        //         });
        // }
    }

    addMemberEmail() {
        const members = [...this.state.members, this.state.memberUsername];
        this.setState({
            memberUsername: '',
            members
        });
    }

    render() {
        return (
            <div className={'create-new-network'}>
                <h3>network name</h3>
                <InputField type={'text'} name={'netName'} placeholder={'new network'} value={this.state.netName} onChange={this.handleInputChange}/>

                <h3>network color</h3>
                <InputField type={'text'} name={'netColor'} placeholder={'color'} value={this.state.netColor} onChange={this.handleInputChange}/>

                <h3>members</h3>
                <div className={'member-add'}>
                    <InputField type={'text'} name={'memberUsername'} placeholder={'username'} value={this.state.memberUsername} onChange={this.handleInputChange}/>
                    <button className={'btn-secondary'} onClick={this.addMemberEmail}>add</button>
                </div>

                <h4>network members</h4>
                <div className={'member-list'}>
                    {this.state.members.length > 0
                        ? this.state.members.map((m) => {
                            return (<p key={m}>{m}</p>)
                        })
                        : (<p>no other members yet!</p>)}
                </div>

                <button className={'btn-primary'} onClick={this.submitNetwork}>create network</button>
            </div>
        );
    }
}
