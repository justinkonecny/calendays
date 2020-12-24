const axios_full = require('axios').default;
const axiosInstance = axios_full.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true
});


export class Api {
    private static prefix: string = 'c';
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
        const response = await axiosInstance.post(`/${Api.prefix}/login`, {}, {
            headers: {
                FirebaseUUID: Api.firebaseId
            }
        });
        Api.lastRefresh = new Date().getTime().valueOf();
        return response;
    }

    static async getHeartbeat() {
        return await Api.queryEndpoint('/');
    }

    static async queryUserNetworks() {
        return await Api.queryEndpoint(`/${Api.prefix}/networks`);
    }

    static async queryUserEvents() {
        return await Api.queryEndpoint(`/${Api.prefix}/events`);
    }

    static async queryUserProfile() {
        return await Api.queryEndpoint(`/${Api.prefix}/users`);
    }

    static async createUserEvent(event: any) {
        return await Api.postBody(`/${Api.prefix}/events`, event);
    }

    static async createUserNetwork(network: any) {
        return await Api.postBody(`/${Api.prefix}/networks`, network);
    }

    static async createUser(user: any) {
        return await Api.postBody(`/${Api.prefix}/signup`, user);
    }

    static async checkUserStatus(username: string, email: string) {
        return await Api.postBody(`/${Api.prefix}/status/user`, {Username: username, Email: email});
    }

    private static async postBody(endpoint: string, body: any) {
        return await axiosInstance.post(endpoint, body);
    }

    private static async queryEndpoint(endpoint: string) {
        let response = await axiosInstance.get(endpoint).catch((error: any) => {
            return error.response;
        });
        if (response?.status === 401 && Api.firebaseId !== '') {
            await Api.refreshSession();
            response = await axiosInstance.get(endpoint);
        }
        return response;
    }

    private static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
