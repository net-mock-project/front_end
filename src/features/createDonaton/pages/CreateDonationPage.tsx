import { useState } from 'react';
import { Breadcrumb, Button, Typography, message, Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { DonationItemsCard } from '../components/DonationItemsCard';
import { TimeAndNotesCard } from '../components/TimeAndNotesCard';
import { createDonation } from '../api/createDonationApi';
import type { DonationFormValues, DonationItem } from '../../../types/donation';

const { Title, Text } = Typography;

export function CreateDonationPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<DonationFormValues>({
    items: [
      { supplyName: '', quantity: 1, unit: 'Thùng' },
    ],
    donationDate: '', 
  });

  const mutation = useMutation({
    mutationFn: createDonation,
    onSuccess: () => {
      message.success('Gửi đơn quyên góp thành công!');
      navigate('/donation'); 
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    },
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemsChange = (items: DonationItem[]) => {
    setFormData((prev) => ({ ...prev, items }));
  };

  const handleSubmit = () => {
    // Validate kiểm tra ngày ủng hộ trước khi gửi
    if (!formData.donationDate) {
      return message.warning('Vui lòng chọn ngày ủng hộ!');
    }
    mutation.mutate(formData);
  };

  return (
    <div style={{ background: '#F6F8FB', minHeight: 'calc(100vh - 68px)', padding: '24px 42px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <Breadcrumb
              items={[
                { title: <Link to="/donation/create">Quyên góp cứu trợ</Link> },
                { title: 'Tạo quyên góp' },
              ]}
              style={{ marginBottom: 8 }}
            />
            <Title level={2} style={{ margin: 0, color: '#172033', fontWeight: 700 }}>
              Quyên góp vật tư cứu trợ
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Thêm vật tư bạn muốn trao tặng để hỗ trợ cộng đồng.
            </Text>
          </div>

          <Button size="large" style={{ borderRadius: 12, fontWeight: 700 }}>
            <Link to="/donation">Quyên góp của tôi</Link>
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <DonationItemsCard
            items={formData.items}
            onChange={handleItemsChange}
          />
          
          <TimeAndNotesCard
            donationDate={formData.donationDate}
            onChange={handleFieldChange}
          />

          <Card bordered={false} style={{ borderRadius: 18, boxShadow: '0px 10px 28px rgba(31, 41, 55, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleSubmit}
                loading={mutation.isPending}
                style={{ 
                  height: 48, 
                  borderRadius: 12, 
                  background: 'linear-gradient(172deg, #E5484D 0%, #EF5F63 100%)',
                  fontWeight: 700,
                  boxShadow: '0px 10px 22px rgba(229, 72, 77, 0.25)',
                  paddingInline: 32
                }}
              >
                Gửi đơn quyên góp
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}

export default CreateDonationPage;