export class ViaPointsMeta {
    switch: boolean;
    viaCityNameError: Array<ViaCityMeta>;
    availableSeatError: string;
    ratePerKMError: string;

    constructor() {
        this.switch = true;
        this.viaCityNameError = [new ViaCityMeta()];
        this.availableSeatError = '';
        this.ratePerKMError = '';
    }
}

export class ViaCityMeta {
    cityNameError: string;

    constructor() {
        this.cityNameError = '';
    }
}

export class CreateRideMeta {
    viaPointComponent: boolean;
    switch: boolean;
    fromError: string;
    validDate: string;
    toError: string;
    dateError: string;
    timeError: string;
    carAvailable: boolean;
    carNotAvailableError: string;
    viaPointcar: boolean;

    constructor() {
        this.viaPointComponent = false;
        this.switch = true;
        this.fromError = '';
        this.validDate = '';
        this.toError = '';
        this.dateError = '';
        this.timeError = '';
        this.carNotAvailableError = '';
        this.carAvailable = true;
        this.viaPointcar = false;
    }
}
