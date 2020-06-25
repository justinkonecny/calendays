export class UserProfile {
    private readonly id: number;
    private readonly firstName: string;
    private readonly lastName: string;
    private readonly email: string;
    private readonly username: string;
    private readonly subscriptionStatusId: number;

    constructor(id: number, firstName: string, lastName: string, email: string, username: string, subscriptionStatusId: number) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.subscriptionStatusId = subscriptionStatusId;
    }

    getId() {
        return this.id;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getEmail(): null | string {
        return this.email;
    }

    getUsername() {
        return this.username;
    }

    getSubscriptionStatusId() {
        return this.subscriptionStatusId;
    }

    getSubscriptionStatus(): string {
        if (this.subscriptionStatusId === 1) {
            return 'Never Subscribed';
        } else if (this.subscriptionStatusId === 2) {
            return 'Subscribed';
        } else if (this.subscriptionStatusId === 3) {
            return 'Unsubscribed';
        } else {
            return 'Unknown';
        }
    }
}
