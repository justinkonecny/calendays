const axios_full = require('axios').default;
const axiosInstance = axios_full.create({
    withCredentials: true,
});


export class Api {
    // private static url: string = 'http://localhost:8080';
    private static url: string = 'https://api.jkonecny.com:8443';
    private static lastRefresh: number = 0;
    private static firebaseId: string = '';

    static setFirebaseId(firebaseId: string) {
        Api.firebaseId = firebaseId;
    }

    static async refreshSessionWithId(firebaseUUID: string) {
        Api.setFirebaseId(firebaseUUID);
        return await Api.refreshSession();
    }

    static async refreshSession() {
        const response = await axiosInstance.post(`${Api.url}/login`, {}, {
            headers: {
                FirebaseUUID: Api.firebaseId,
            }
        });
        Api.lastRefresh = new Date().getTime().valueOf();
        return response;
    }

    static async logout() {

    }

    static async queryUserNetworks() {
        return await Api.queryEndpoint('networks');
    }

    static async queryUserEvents() {
        return await Api.queryEndpoint('events');
    }

    static async queryUserProfile() {
        return await Api.queryEndpoint('users');
    }

    static async createUserEvent(event: any) {
        return await Api.postBody('events', event);
    }

    static async createUserNetwork(network: any) {
        return await Api.postBody('networks', network);
    }

    static async createUser(user: any) {
        return await Api.postBody('signup', user);
    }

    static async checkUserStatus(username: string, email: string) {
        return await Api.postBody('status/user', {Username: username, Email: email});
    }

    private static async postBody(endpoint: string, body: any) {
        return await axiosInstance.post(`${Api.url}/${endpoint}`, body);
    }

    private static async queryEndpoint(endpoint: string) {
        let response = await axiosInstance.get(`${Api.url}/${endpoint}`).catch((error: any) => {
            return error.response;
        });
        if (response.status === 401 && Api.firebaseId !== '') {
            await Api.refreshSession();
            response = await axiosInstance.get(`${Api.url}/${endpoint}`);
        }
        return response;
    }

    private static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
