export class UserProfile {
    private readonly id: number;
    private readonly firstName: string;
    private readonly lastName: string;
    private readonly email: string;
    private readonly username: string;

    constructor(id: number, firstName: string, lastName: string, email: string, username: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
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
}
