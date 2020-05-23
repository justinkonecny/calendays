export class NetworkEvent {
    private readonly id: number;
    private readonly name: string;
    private readonly startDate: Date;
    private readonly endDate: Date;
    private readonly location: number;
    private readonly message: number;
    private readonly networkId: number;

    constructor(id: number, name: string, startDate: number, endDate: number, location: number, message: number, networkId: number) {
        this.id = id;
        this.name = name;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.location = location;
        this.message = message;
        this.networkId = networkId;
    }

    public getId() {
        return this.id;
    }

    public getName() {
        return this.name;
    }

    public getStartDate() {
        return this.startDate;
    }

    public getEndDate() {
        return this.endDate;
    }

    public getLocation() {
        return this.location;
    }

    public getNetworkId() {
        return this.networkId;
    }
}
