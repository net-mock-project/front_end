export interface ReliefRequest {
    id: string;
    requesterId: string;
    coordinatorId: string | null;
    reliefImageUrl: string | null;
    requestedResource:string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    startTime: string;
    endTime: string ;
    urgencyLevel: number;
    estimatedAffectedRadiusKm: number;
    estimatedAffectedPeople: number;
    status: string;
    completedAt: string | null;
    createdAt: string;
    reliefTasks?: ReliefTask[];
}

export interface ReliefTask {
    id: string;
    requestId: string;
    title: string;
    description: string;
    requiredVolunteers: number;
    priority: number;
    latitude: number;
    longitude: number;
    status: string;
    taskSkills: string[];
    createdAt: string;
    updatedAt: string | null;
}

export interface ReliefTaskPayload {
    title: string;
    description: string;
    requiredVolunteers: number;
    priority: number;
    latitude: number;
    longitude: number;
    taskSkills: string[];
}

export interface SuitableVolunteer {
    volunteerId: string;
    fullName?: string;
    email?: string;
    phone?: string;
    profileUrl?: string | null;
    experienceYears?: number;
    skills?: string[];
}

export interface ReliefRequestPayload {
    longitude: number;
    latitude: number;
    title: string;
    description: string;
    reliefImageUrl: string;
    requestedResource: string;
    urgencyLevel: number;
    estimatedAffectedPeople: number;
    estimatedAffectedRadiusKm: number;
}