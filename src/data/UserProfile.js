class UserProfile {
    constructor(firstName, lastName, email, uid, username, networks) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.uid = uid;
        this.username = username;
        this.networks = networks;
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

    getEmail() {
        return this.email;
    }

    getUid() {
        return this.uid;
    }

    getUsername() {
        return this.username;
    }

    getNetworks() {
        return this.networks;
    }

    setNetworks(networkList) {
        return this.networks = networkList;
    }
}

export default UserProfile;
