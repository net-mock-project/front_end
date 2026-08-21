export const RELIEF_SKILLS = [
  ['30000000-0000-0000-0000-000000000001', 'First Aid'],
  ['30000000-0000-0000-0000-000000000002', 'Medical'],
  ['30000000-0000-0000-0000-000000000003', 'Driving'],
  ['30000000-0000-0000-0000-000000000004', 'Swimming'],
  ['30000000-0000-0000-0000-000000000005', 'Rescue'],
  ['30000000-0000-0000-0000-000000000006', 'Logistics'],
  ['30000000-0000-0000-0000-000000000007', 'Communication'],
  ['30000000-0000-0000-0000-000000000008', 'Cooking'],
] as const

const RELIEF_SKILL_NAMES: Record<string, string> = Object.fromEntries(
  RELIEF_SKILLS,
)

export function getReliefSkillName(skillId: string) {
  return RELIEF_SKILL_NAMES[skillId] ?? skillId
}
