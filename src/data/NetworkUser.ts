export class NetworkUser {
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

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getEmail() {
        return this.lastName;
    }

    getUsername() {
        return this.username;
    }
}
