export class BookARideMeta {
    switch: boolean;
    fromError: string;
    toError: string;
    dateError: string;
    bookingSearch: boolean;

    constructor() {
        this.switch = true;
        this.fromError = '';
        this.toError = '';
        this.dateError = '';
        this.bookingSearch = false;
    }
}

