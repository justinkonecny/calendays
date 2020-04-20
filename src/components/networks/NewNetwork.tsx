import React, {Component} from 'react';
import '../../css/networks/NewNetwork.scss';
import {DbConstants} from '../../data/DbConstants';
import InputField from '../common/InputField';
import {NetworkGroup} from '../../data/NetworkGroup';
import {UserProfile} from '../../data/UserProfile';
import * as firebase from 'firebase';

interface NewNetworkProps {
    db: firebase.firestore.Firestore;
    userProfile: UserProfile;
    handleFailure: (error: any) => void;
    handleSuccess: (networkGroup: NetworkGroup) => void;
}

interface NewNetworkState {
    netName: string;
    memberId: string;
}

export class NewNetwork extends Component<NewNetworkProps, NewNetworkState> {
    constructor(props: NewNetworkProps) {
        super(props);

        this.state = {
            netName: '',
            memberId: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitNetwork = this.submitNetwork.bind(this);
        this.addNetworkToUsers = this.addNetworkToUsers.bind(this);
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

    submitNetwork() {
        if (!this.props.userProfile) {
            console.error('User is not authenticated!');
            return;
        }

        if (this.state.memberId.trim() === '') {
            return;
        }

        let members = this.state.memberId.split(',');
        members.push(this.props.userProfile.getUid());
        members = members.map(member => {
            return member.trim()
        });

        const newNetwork: NetworkGroup = new NetworkGroup(
            this.props.db,
            this.state.netName,
            (new Date()).toString(),
            members,
            this.props.userProfile.getUid());

        // const newNetwork = {
        //     name: this.state.netName,
        //     timestamp: (new Date()).toString(),
        //     members: members,  // TODO: Fix this to be a proper list
        //     owner: this.props.userProfile.getUid()
        // };

        this.props.db.collection(DbConstants.NETWORKS)
            .add(newNetwork)
            .then(docRef => {
                console.log('Successfully created a new network');
                this.addNetworkToUsers(docRef.id, newNetwork);
            })
            .catch(error => {
                console.error('Failed to create a new network!');
                console.error(error);
                this.props.handleFailure(error);
            });
    }

    addNetworkToUsers(networkId: string, network: NetworkGroup) {
        // TODO: Validate MemberIDs before adding network to user

        for (const userId of network.getMembers()) {
            // First get the user's list of current networks
            this.props.db.collection(DbConstants.USERS)
                .doc(userId)
                .collection(DbConstants.NETWORKS).get()
                .then(col => {
                    if (col.empty) {
                        // CASE: User has no networks yet, so create the first document
                        const newNetworksList = {[DbConstants.MEMBER_OF]: [networkId]};
                        this.props.db.collection(DbConstants.USERS)
                            .doc(userId)
                            .collection(DbConstants.NETWORKS)
                            .add(newNetworksList)
                            .then(docRef => {
                                if (userId === this.props.userProfile.getUid()) {
                                    // this.props.handleSuccess(networkId);
                                    // TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                }
                            })
                            .catch(error => {
                                console.error('Error adding network to user');
                                this.props.handleFailure(error);
                            });
                    } else {
                        // CASE: User has a list of networks already, so update it
                        const doc = col.docs[0];
                        const networkList = doc.data()[DbConstants.MEMBER_OF];
                        networkList.push(networkId);

                        const updatedNetworksList = {[DbConstants.MEMBER_OF]: networkList};
                        this.props.db.collection(DbConstants.USERS)
                            .doc(userId)
                            .collection(DbConstants.NETWORKS)
                            .doc(doc.id)
                            .update(updatedNetworksList)
                            .then(docRef => {
                                if (userId === this.props.userProfile.getUid()) {
                                    this.props.handleSuccess(network);
                                }
                            })
                            .catch(error => {
                                console.error('Error adding network to user');
                                this.props.handleFailure(error);
                            });
                    }
                })
                .catch(error => {
                    console.error('Failed to get user networks');
                    console.error(error);
                });
        }
    }

    render() {
        return (
            <div className={'create-new-network'}>
                <h3>network name</h3>
                <InputField type={'text'} name={'netName'} placeholder={'new network'} value={this.state.netName} onChange={this.handleInputChange}/>

                <h3>member id</h3>
                <InputField type={'text'} name={'memberId'} placeholder={'member id'} value={this.state.memberId} onChange={this.handleInputChange}/>

                <button className={'btn-primary'} onClick={this.submitNetwork}>create network</button>
            </div>
        );
    }
}
