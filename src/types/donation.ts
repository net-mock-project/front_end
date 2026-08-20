export type DonationItem = {
  supplyName: string;
  quantity: number;
  unit: string;
};

export type DonationFormValues = {
  items: DonationItem[];
  donationDate: string; 
};

export type MyDonationRecord = {
  code: string;
  donatorName: string;
  donatorPhone: string;
  items: string;      
  WarehouseName: string;    
  donationDate: string;  
  status: 'PENDING' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
};
