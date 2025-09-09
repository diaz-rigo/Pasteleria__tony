// src/app/shared/types/orders.types.ts

export type ModoPedido = 'APARTAR' | 'PEDIR';
export type MetodoEntrega = 'RECOGER' | 'DOMICILIO';

export interface VariantSelection {
  flavor?: string;
  color?: string;
  texture?: string;
  shape?: string;
}

export interface CreateOrderRequest {
  // Datos del form
  nombre: string;
  telefono: string;              // 10 dígitos MX
  email: string;

  metodoEntrega: MetodoEntrega;
  direccion?: string;            // requerido si DOMICILIO
  fecha: string;                 // "YYYY-MM-DD"
  hora?: string;                 // "HH:mm"

  dedicatoria?: string;
  decoracion?: string;
  nota?: string;

  // Modo y selección
  modo: ModoPedido;              // 'APARTAR' | 'PEDIR'
  productId: string;
  variant?: VariantSelection;
  size: number;                  // kg
  quantity: number;
  unitPrice: number;
  images?: string[];
}

// ----- Respuesta del backend -----

export interface OrderItem {
  productId: string;
  productName: string;
  brand?: string;
  category?: string;
  flavor?: string;
  color?: string;
  texture?: string;
  shape?: string;
  size: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  availabilityStatus: 'available' | 'on_demand' | 'out_of_stock';
  images?: string[];
}

export interface CustomerInfo {
  isGuest: boolean;
  userId?: string;
  guestId?: string;
  nombre: string;
  telefono: string;
  email: string;
  emailVerificado?: boolean;
  telefonoVerificado?: boolean;
}

export interface ScheduleInfo {
  fecha: string;   // ISO
  horaStr?: string;
}

export interface AddressInfo {
  linea1?: string;
  linea2?: string;
  colonia?: string;
  ciudad?: string;
  estado?: string;
  cp?: string;
  notasMensajeria?: string;
}

export interface DeliveryInfo {
  metodoEntrega: MetodoEntrega;
  address?: AddressInfo;
  schedule: ScheduleInfo;
}

export interface CustomizationInfo {
  dedicatoria?: string;
  decoracion?: string;
  nota?: string;
}

export interface PaymentInfo {
  method: 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA' | 'ONLINE' | 'NO_APLICA';
  status: 'PENDIENTE' | 'AUTORIZADO' | 'RECHAZADO' | 'REEMBOLSADO' | 'NO_APLICA';
  currency: 'MXN' | string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  depositRequired?: boolean;
  depositAmount?: number;
  provider?: string;
  providerIntentId?: string;
  providerChargeId?: string;
}

export interface MetaInfo {
  mode: ModoPedido;
  status:
    | 'CREADO'
    | 'PENDIENTE_PAGO'
    | 'CONFIRMADO'
    | 'PREPARACION'
    | 'LISTO'
    | 'EN_CAMINO'
    | 'ENTREGADO'
    | 'CANCELADO';
  source: 'web' | 'app' | 'whatsapp' | 'admin';
  notesAdmin?: string;
  holdUntil?: string;
}

export interface Order {
  _id: string;
  orderCode: string;
  customer: CustomerInfo;
  delivery: DeliveryInfo;
  customization?: CustomizationInfo;
  items: OrderItem[];
  payment: PaymentInfo;
  meta: MetaInfo;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ApiOkOrder {
  ok: true;
  data: Order;
}

export interface ApiOkOrders {
  ok: true;
  data: Order[];
}

export interface ApiError {
  ok: false;
  msg: string;
  errors?: string[];
  error?: string;
}

// Helper de discriminación de tipo
export function isApiOkOrder(x: any): x is ApiOkOrder {
  return !!x && x.ok === true && x.data && !!x.data.orderCode;
}
