export interface VolunteerSkill {
  skillId: string
  level: number
}

export interface VolunteerProfile {
  experienceYears: number
  cvUrl: string | null
  skills: VolunteerSkill[]
  approvalStatus?: string | null
}

export interface VolunteerProfilePayload {
  experienceYears: number
  cvUrl: string
  skills: VolunteerSkill[]
}
