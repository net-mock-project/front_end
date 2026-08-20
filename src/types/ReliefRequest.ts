export interface ReliefRequest {
    id: string;
    requesterId: string;
    coordinatorId: string;
    reliefImageUrl: string;
    requestedResource:string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    startTime: string;
    endTime: string;
    urgencyLevel: number;
    estimatedAffectedRadiusKm: number;
    estimatedAffectedPeople: number;
    status: string;
    completedAt: string;
    createdAt: string;
}