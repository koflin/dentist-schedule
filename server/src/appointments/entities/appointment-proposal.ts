export class AppointmentProposal {
    
    constructor(from?: Date, to?: Date) {
        this.from = from;
        this.to = to;
    }

    from: Date;

    to: Date;
}