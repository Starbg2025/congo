
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  image: string;
  status: 'Disponible' | 'Vendu';
  created_at: string;
}

export interface Reservation {
  id: string;
  car_id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  created_at: string;
  car?: Car;
}

export interface UserMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  role: 'admin' | 'client';
}
