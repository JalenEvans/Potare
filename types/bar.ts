export type Bar = {
  id: number;
  name: string;
  address: string;
  coords: {
    latitude: number;
    longitude: number;
  };
};

export type BarCreate = {
  name: string;
  address: string;
  coords: {
    latitude: number;
    longitude: number;
  };
};

export type BarResponse = {
  id: number;
  name: string;
  address: string;
  coords: {
    latitude: number;
    longitude: number;
  };
};
