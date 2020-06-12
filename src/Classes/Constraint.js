export const Required = 'Required';

export const Invalid = 'Invalid';

export const NameRegex = /^[a-zA-Z ]*$/;

export const EmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const PasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

export const MobileNumberRegex = /^[6789]\d{9}$/;

export const DrivingLicenceRegex = /^[0-9a-zA-Z]{4,9}$/;

export const UserNameAvailability = 'Already exists';