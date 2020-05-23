import {UserProfile} from './UserProfile';
import {NetworkUser} from './NetworkUser';

export class NetworkGroup {
    private readonly id: number;
    private readonly name: string;
    private readonly ownerId: number;
    private readonly colorHex: string;
    private readonly members: NetworkUser[];
    // private timestamp: string;
    // private members: string[];
    // private users: UserProfile[];
    // private color: string;


    constructor(id: number, name: string, ownerId: number, colorHex: string, members: NetworkUser[]) {
        this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this.colorHex = colorHex;
        this.members = members;

        // this.name = name;  // (string): the group name
        // this.timestamp = timestamp;  // (string): the creation date/time
        // this.members = members;  // (list of UID): list of group members
        // this.users = [];  // (list of UserProfile): list of group members
        // this.owner = owner ? owner : null;
        // this.color = '#467c95';
        // this.id = -1;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getOwnerId() {
        return this.ownerId;
    }

    getColorHex() {
        return this.colorHex;
    }

    getMembers() {
        return this.members;
    }

    // getTimestamp(): string {
    //     return this.timestamp;
    // }
    //
    // getMembers(): string[] {
    //     return this.members;
    // }
    //
    // getUsers(): UserProfile[] {
    //     return this.users;
    // }
    //
    // setUsers(users: UserProfile[]): void {
    //     this.users = users;
    // }
    //
    // addUser(user: UserProfile): void {
    //     this.users.push(user);
    // }
    //
    // setColor(color: string) {
    //     this.color = color;
    // }
    //
    // getColor() {
    //     return this.color;
    // }

    // setId(id: number) {
    //     this.id = id;
    // }
    //
    // toDictionary() {
    //     return {
    //         name: this.name,
    //         timestamp: this.timestamp,
    //         members: this.members,
    //         owner: this.owner
    //     };
    // }
}
