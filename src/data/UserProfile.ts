import {NetworkGroup} from './NetworkGroup';

export class UserProfile {
    private firstName: string;
    private lastName: string;
    private email: null | string;
    private uid: string;
    private username: string;
    private networks: null | NetworkGroup[];

    constructor(firstName: string, lastName: string, email: null | string, uid: string, username: string, networks: null | NetworkGroup[]) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.uid = uid;
        this.username = username;
        this.networks = networks;
    }

    getFullName(): string {
        return this.firstName + ' ' + this.lastName;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getEmail(): null | string {
        return this.email;
    }

    getUid(): string {
        return this.uid;
    }

    getUsername(): string {
        return this.username;
    }

    getNetworks(): null | NetworkGroup[] {
        return this.networks;
    }

    setNetworks(networkList: NetworkGroup[]): void {
        this.networks = networkList;
    }
}
