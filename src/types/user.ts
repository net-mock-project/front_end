export interface User {
    userId: number;
    fullName: string;
    email: string;
    status: string;
    province: string;
    profileUrl: string;
    roleName: string;
    phone: string;
    location: {
        latitude: number;
        longitude: number;
    };
}