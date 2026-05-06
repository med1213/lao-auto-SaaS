export type Tenant = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  phone?: string;
  whatsapp?: string;
  messengerUrl?: string;
  address?: string;
};

export type CarImage = {
  id?: string;
  url: string;
  isPrimary?: boolean;
};

export type Car = {
  id: string;
  tenantId: string;
  tenant?: Tenant;
  make: string;
  model: string;
  trim: string;
  year: number;
  priceLak: string;
  mileageKm?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  location?: string;
  description?: string;
  isFeatured: boolean;
  isLimitedStock: boolean;
  viewCount: number;
  clickCount: number;
  images: CarImage[];
};

export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

