"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ViaPointsMeta = /** @class */ (function () {
    function ViaPointsMeta() {
        this.switch = true;
        this.viaCityNameError = [new ViaCityMeta()];
        this.availableSeatError = '';
        this.ratePerKMError = '';
    }
    return ViaPointsMeta;
}());
exports.ViaPointsMeta = ViaPointsMeta;
var ViaCityMeta = /** @class */ (function () {
    function ViaCityMeta() {
        this.cityNameError = '';
    }
    return ViaCityMeta;
}());
exports.ViaCityMeta = ViaCityMeta;
var CreateRideMeta = /** @class */ (function () {
    function CreateRideMeta() {
        this.viaPointComponent = false;
        this.switch = true;
        this.fromError = '';
        this.validDate = '';
        this.toError = '';
        this.dateError = '';
        this.carNotAvailableError = '';
        this.carAvailable = true;
    }
    return CreateRideMeta;
}());
exports.CreateRideMeta = CreateRideMeta;
//# sourceMappingURL=Ride.js.map