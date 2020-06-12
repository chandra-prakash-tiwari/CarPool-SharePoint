export class LoginRequest {
    userName: string;
    password: string;

    constructor() {
        this.userName = '';
        this.password = '';
    }
}

export class User {
    name: string;
    mobile: string;
    userName: string;
    address: string;
    drivingLicence: string;
    email: string;
    password: string;
    confirmPassword: string;

    constructor() {
        this.name = '';
        this.mobile = '';
        this.userName = '';
        this.address = '';
        this.drivingLicence = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
    }
}