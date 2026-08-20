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
  donationId: string;     
  donatorName: string;
  donatorPhone: string;
  items: DonationItem[]; 
  warehouseName: string;  
  donationDate: string;  
  status: string;         
};