export class AddNewCarMeta {
    switch: boolean;
    carNumberError: string;
    carModelError: string;
    seatError: string;
    serverError: boolean;
    hasCarNumber: boolean;

    constructor() {
        this.switch = true;
        this.carNumberError = '';
        this.carModelError = '';
        this.seatError = '';
        this.serverError = false;
        this.hasCarNumber = false;
    }
}

