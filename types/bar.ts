export type Bar = {
  id: number;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  notes: string | null;
};

export type BarCreate = {
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  rating?: number | null;
  notes?: string | null;
};

export type BarResponse = {
  id: number;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  notes: string | null;
};