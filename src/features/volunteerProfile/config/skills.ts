export const VOLUNTEER_SKILLS = [
  {
    skillId: '30000000-0000-0000-0000-000000000001',
    name: 'First Aid',
  },
  {
    skillId: '30000000-0000-0000-0000-000000000002',
    name: 'Medical',
  },
  {
    skillId: '30000000-0000-0000-0000-000000000003',
    name: 'Driving',
  },
  {
    skillId: '30000000-0000-0000-0000-000000000004',
    name: 'Swimming',
  },
  {
    skillId: '30000000-0000-0000-0000-000000000005',
    name: 'Rescue',
  },
  {
    skillId: '30000000-0000-0000-0000-000000000006',
    name: 'Logistics',
  },
  {
    skillId: '30000000-0000-0000-0000-000000000007',
    name: 'Communication',
  },
  {
    skillId: '30000000-0000-0000-0000-000000000008',
    name: 'Cooking',
  },
] as const

export function getVolunteerSkillName(skillId: string) {
  return VOLUNTEER_SKILLS.find((skill) => skill.skillId === skillId)?.name ?? skillId
}
