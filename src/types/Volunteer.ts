import type { User } from "./User";

export interface Volunteer extends User {
    experienceYears: number;
    approvalStatus: string;
    
}