import {UserProfile} from './UserProfile';

export class NetworkGroup {
    private db: any;
    private name: string;
    private timestamp: string;
    private members: string[];
    private users: UserProfile[];
    private owner: null | string;
    private color: string;
    private id: string;

    constructor(db: any, name: string, timestamp: string, members: string[], owner?: string) {
        this.db = db;  // Firebase Firestore
        this.name = name;  // (string): the group name
        this.timestamp = timestamp;  // (string): the creation date/time
        this.members = members;  // (list of UID): list of group members
        this.users = [];  // (list of UserProfile): list of group members
        this.owner = owner ? owner : null;
        this.color = '#467c95';
        this.id = '';
    }

    getName(): string {
        return this.name;
    }

    getTimestamp(): string {
        return this.timestamp;
    }

    getMembers(): string[] {
        return this.members;
    }

    getUsers(): UserProfile[] {
        return this.users;
    }

    setUsers(users: UserProfile[]): void {
        this.users = users;
    }

    addUser(user: UserProfile): void {
        this.users.push(user);
    }

    setColor(color: string) {
        this.color = color;
    }

    getColor() {
        return this.color;
    }

    getId() {
        return this.id;
    }

    setId(id: string) {
        this.id = id;
    }

    toDictionary() {
        return {
            name: this.name,
            timestamp: this.timestamp,
            members: this.members,
            owner: this.owner
        };
    }
}
