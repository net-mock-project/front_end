export interface Warehouse {
    warehouseId: number;
    name: string;
    location: {
        latitude: number;
        longitude: number;
    };
    phone: string;
    province: string;
}