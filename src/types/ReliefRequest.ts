export interface ReliefRequest {
    requestId: number;
    title: string;
    description: string;
    location: {
        latitude: number;
        longitude: number;
    };
    estimatedAffectedRadiusKm: number;
}