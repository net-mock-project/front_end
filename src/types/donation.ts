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
  items: DonationItem[];      
  WarehouseName: string;    
  donationDate: string;  
  status: string;
};
