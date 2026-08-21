import httpClient from "../../../api/httpClient";
import type { Volunteer } from "../../../types/Volunteer";

interface VolunteerApiItem {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    profileUrl: string | null;
    latitude: number;
    longitude: number;
    province: string | null;
    experienceYears: number;
    approvalStatus: string;
}

interface VolunteerApiResponse {
    result: {
        items: VolunteerApiItem[];
    };
}

export async function getAllVolunteers(): Promise<Volunteer[]> {
    const response = await httpClient.get<VolunteerApiResponse>("/api/coordinator/volunteers", {
        params: { PageNumber: 1, PageSize: 20 },
    });

    return response.data.result.items.map((volunteer) => ({
        id: volunteer.id,
        fullName: volunteer.fullName,
        email: volunteer.email,
        phone: volunteer.phone,
        profileUrl: volunteer.profileUrl ?? "",
        latitude: volunteer.latitude,
        longitude: volunteer.longitude,
        province: volunteer.province ?? "Chưa cập nhật",
        experienceYears: volunteer.experienceYears,
        approvalStatus: volunteer.approvalStatus,
        status: "ACTIVE",
        roleName: "VOLUNTEER",
    }));
}
