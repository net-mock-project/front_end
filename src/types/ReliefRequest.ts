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
    startTime: string | null;
    endTime: string | null;
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
    title?: string;
    description?: string;
    status?: string;
    volunteerId?: string | null;
    startTime?: string | null;
    endTime?: string | null;
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