export interface User {
    userId: number;
    fullName: string;
    email: string;
    status: string;
    province: string;
    profileUrl: string;
    role: string;
    phoneNumber: string;
    location: {
        latitude: number;
        longitude: number;
    };
}