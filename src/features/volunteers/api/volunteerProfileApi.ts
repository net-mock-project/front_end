import httpClient from "../../../api/httpClient";
import type {
  SubmitVolunteerProfileRequest,
  UpdateVolunteerProfileRequest,
  Volunteer,
} from "../../../types/Volunteer";
import { SYSTEM_SKILLS, getSkillNameById } from "../constants/skills";

const normalizeVolunteer = (data: any): Volunteer => {
  if (!data) return data;
  const raw = data?.result || data?.data || data;

  const rawSkills = raw?.skills || [];
  const skills = rawSkills.map((s: any) => ({
    skillId: s.skillId || s.id,
    skillName: s.skillName || getSkillNameById(s.skillId || s.id),
    level: s.level ?? 1,
  }));

  return {
    ...raw,
    volunteerId: raw.volunteerId || raw.id,
    skills,
  };
};

export const volunteerProfileApi = {
  getMyProfile: async (): Promise<Volunteer | null> => {
    try {
      const response = await httpClient.get("/api/volunteers/profile");
      return normalizeVolunteer(response.data);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getAvailableSkills: async () => {
    try {
      const response = await httpClient.get("/api/skills");
      const raw = response.data?.result || response.data?.data || response.data;
      return Array.isArray(raw) && raw.length > 0 ? raw : SYSTEM_SKILLS;
    } catch {
      return SYSTEM_SKILLS;
    }
  },

  submitProfile: async (data: SubmitVolunteerProfileRequest): Promise<Volunteer> => {
    const response = await httpClient.post("/api/volunteers/profile", data);
    return normalizeVolunteer(response.data);
  },

  updateProfile: async (data: UpdateVolunteerProfileRequest): Promise<Volunteer> => {
    const response = await httpClient.put("/api/volunteers/profile", data);
    return normalizeVolunteer(response.data);
  },

  cancelProfile: async (): Promise<{ message: string }> => {
    const response = await httpClient.delete("/api/volunteers/profile");
    return response.data?.result || response.data;
  },
};