export interface OrderCustomer {
  nombre: string;
  telefono: string;     // 10 dígitos MX
  email: string;
  dedicatoria?: string; // opcional
  direccion?: string;   // opcional si entrega a domicilio
  metodoEntrega: 'RECOGER' | 'DOMICILIO';
  fecha: string;        // ISO (YYYY-MM-DD)
  hora: string;         // HH:mm
  nota?: string;        // opcional
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantFlavor?: string;
  size?: string | number; // ej. "1" o "1.0" kg
  unitPrice: number;
  quantity: number;
  subtotal: number;
  image?: string;
  color?: string;
}

export interface OrderCreatePayload {
  items: OrderItem[];
  customer: OrderCustomer;
  modo: 'PEDIR' | 'APARTAR';
  currency?: 'MXN' | 'USD';
  source?: 'WEB';
}

export interface OrderCreateResponse {
  id: string;
  folio: string;
  total: number;
  createdAt: string;
  status: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
}
