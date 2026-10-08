export type PropertyStatus = 'available' | 'negotiating' | 'sold';
export type PropertyType = 'apartment' | 'villa' | 'commercial' | 'land';

export interface Property {
  id: string;
  slug: string;
  title: string;
  propertyType: PropertyType;
  propertyTypeLabel: string;
  status: PropertyStatus;
  statusLabel: string;
  priceToman: number;
  pricePerMeterToman: number;
  areaSqm: number;
  bedrooms: number;
  yearBuilt: number;
  floor?: number;
  totalFloors?: number;
  neighborhood: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
  description: string;
  images: {
    url: string;
    alt: string;
    isPrimary?: boolean;
  }[];
  advisor: {
    name: string;
    phone: string;
    avatar: string;
    role: string;
  };
  isPublic: boolean;
  sample: true;
  createdAt: string;
}
