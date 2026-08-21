export interface SystemSkill {
  id: string;
  name: string;
  description: string;
}

export const SYSTEM_SKILLS: SystemSkill[] = [
  {
    id: "30000000-0000-0000-0000-000000000001",
    name: "First Aid",
    description: "Sơ cấp cứu cơ bản và ứng phó khẩn cấp",
  },
  {
    id: "30000000-0000-0000-0000-000000000002",
    name: "Medical",
    description: "Hỗ trợ y tế và chăm sóc sức khỏe",
  },
  {
    id: "30000000-0000-0000-0000-000000000003",
    name: "Driving",
    description: "Lái xe và vận hành phương tiện vận chuyển khẩn cấp",
  },
  {
    id: "30000000-0000-0000-0000-000000000004",
    name: "Swimming",
    description: "Kỹ năng bơi lội và cứu hộ vùng nước",
  },
  {
    id: "30000000-0000-0000-0000-000000000005",
    name: "Rescue",
    description: "Tìm kiếm và cứu hộ trong vùng thiên tai",
  },
  {
    id: "30000000-0000-0000-0000-000000000006",
    name: "Logistics",
    description: "Hậu cần cứu trợ và quản lý kho vận",
  },
  {
    id: "30000000-0000-0000-0000-000000000007",
    name: "Communication",
    description: "Truyền thông và điều phối thông tin",
  },
  {
    id: "30000000-0000-0000-0000-000000000008",
    name: "Cooking",
    description: "Nấu ăn và chuẩn bị suất ăn cho cộng đồng",
  },
];

export const getSkillNameById = (skillId: string): string => {
  const found = SYSTEM_SKILLS.find(
    (s) => s.id.toLowerCase() === skillId.toLowerCase()
  );
  return found ? found.name : "Kỹ năng";
};