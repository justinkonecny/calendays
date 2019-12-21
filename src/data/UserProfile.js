class UserProfile {
    constructor(firstName, lastName, email, uid) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.uid = uid;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }

    getFistName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getEmail() {
        return this.email;
    }

    getUid() {
        return this.uid;
    }
}

export default UserProfile;
