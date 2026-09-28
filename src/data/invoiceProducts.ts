import { BankCardType, BankConfig, InvoiceProduct, SupermarketId, SupermarketInfo } from '../types/products';

export const SUPERMARKETS: SupermarketInfo[] = [
  {
    id: 'carrefour',
    name: 'Carrefour Hiper',
    shortName: 'Carrefour',
    color: '#004F9F',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    badgeBg: 'bg-blue-600 text-white',
    category: 'Hipermercado',
    websiteUrl: 'https://www.carrefour.com.ar',
    bankBenefits: {
      bbva: '15% reintegro los martes (tope $6.000)',
      santander: '20% con Santander Select los miércoles (tope $8.000)',
      naranja: 'Plan Z (3 cuotas sin interés) o 15% los jueves (tope $5.000)',
      propia: '15% - 20% off con Tarjeta Mi Carrefour y 2do al 50%/70%'
    },
    bestDays: [
      { day: 'Miércoles', deal: '20% OFF con Santander Select (tope $8.000) o Santander Débito', bank: 'Santander' },
      { day: 'Martes', deal: '20% OFF con Tarjeta Mi Carrefour / 15% con MODO BBVA', bank: 'BBVA / Carrefour' },
      { day: 'Jueves', deal: '15% OFF con Tarjeta Naranja X + 3 cuotas Plan Z', bank: 'Naranja X' }
    ]
  },
  {
    id: 'coto',
    name: 'Coto C.I.C.S.A.',
    shortName: 'Coto',
    color: '#E30613',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    badgeBg: 'bg-red-600 text-white',
    category: 'Hipermercado',
    websiteUrl: 'https://www.cotodigital3.com.ar',
    bankBenefits: {
      bbva: '20% reintegro viernes con MODO/BBVA (tope $12.000) o 25% Premium (tope $15.000)',
      santander: '20% de ahorro los miércoles (tope $10.000) con débito/crédito',
      naranja: '20% los martes con Tarjeta Naranja X (tope $8.000) y Plan Z',
      propia: 'Comunidad Coto 15% lunes a jueves en rubros seleccionados'
    },
    bestDays: [
      { day: 'Viernes', deal: '20% a 25% de reintegro con MODO BBVA (tope hasta $15.000)', bank: 'BBVA' },
      { day: 'Miércoles', deal: '20% de ahorro exclusivo con Banco Santander (tope $12.000)', bank: 'Santander' },
      { day: 'Martes', deal: '20% con Tarjeta Naranja X y 3 cuotas cero interés Plan Z', bank: 'Naranja X' },
      { day: 'Lunes a Jueves', deal: 'Comunidad Coto 15% en pastas, lácteos y carnicería', bank: 'Comunidad Coto' }
    ]
  },
  {
    id: 'makro',
    name: 'Supermercados Makro',
    shortName: 'Makro',
    color: '#002D62',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    textColor: 'text-indigo-800',
    badgeBg: 'bg-indigo-900 text-white',
    category: 'Mayorista',
    websiteUrl: 'https://www.makro.com.ar',
    bankBenefits: {
      bbva: '20% reintegro jueves con BBVA Empresas y Comercios',
      santander: '15% reintegro martes con tarjeta Visa Santander (tope $9.000)',
      naranja: 'Plan Z permanente en artículos de almacén y bazar',
      propia: 'Precios escalonados por bulto cerrado y caja de leche/fideos'
    },
    bestDays: [
      { day: 'Jueves', deal: '20% de reintegro con BBVA (tope $12.000) en compras mayoristas', bank: 'BBVA' },
      { day: 'Martes', deal: '15% de ahorro con Visa Santander Débito', bank: 'Santander' },
      { day: 'Todos los días', deal: 'Máximo ahorro llevando bulto cerrado (caja x24 leche, x12 puré)', bank: 'Precio Mayorista' }
    ]
  },
  {
    id: 'abastecedor',
    name: 'El Abastecedor',
    shortName: 'El Abastecedor',
    color: '#15803D',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-800',
    badgeBg: 'bg-emerald-700 text-white',
    category: 'Supermercado',
    websiteUrl: 'https://elabastecedor.com.ar',
    bankBenefits: {
      bbva: '15% reintegro sábados pagando con MODO BBVA (tope $6.000)',
      santander: '15% de ahorro los viernes (tope $7.000)',
      naranja: '20% los sábados con Naranja X (tope $7.000)',
      propia: 'Ofertas semanales agresivas en carnes, fiambres y lácteos'
    },
    bestDays: [
      { day: 'Sábados', deal: '20% con Naranja X / 25% con Cuenta DNI en carnes y fiambres', bank: 'Naranja X / DNI' },
      { day: 'Viernes', deal: '15% de descuento con Santander en lácteos y quesos', bank: 'Santander' }
    ]
  },
  {
    id: 'disco',
    name: 'Supermercados Disco',
    shortName: 'Disco',
    color: '#C62828',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-700',
    badgeBg: 'bg-rose-700 text-white',
    category: 'Supermercado',
    websiteUrl: 'https://www.disco.com.ar',
    bankBenefits: {
      bbva: '20% reintegro los martes con BBVA MODO (tope $10.000)',
      santander: '20% ahorro los lunes con Santander Black/Platinum (tope $12.000)',
      naranja: '15% los jueves con Naranja X (tope $6.000)',
      propia: 'Disco Plus: 2do al 70% en categorías rotativas'
    },
    bestDays: [
      { day: 'Martes', deal: '20% de reintegro con BBVA MODO', bank: 'BBVA' },
      { day: 'Lunes', deal: '20% con Santander Black y Platinum', bank: 'Santander' }
    ]
  },
  {
    id: 'jumbo',
    name: 'Jumbo Hipermercado',
    shortName: 'Jumbo',
    color: '#00843D',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-300',
    textColor: 'text-teal-800',
    badgeBg: 'bg-teal-700 text-white',
    category: 'Hipermercado',
    websiteUrl: 'https://www.jumbo.com.ar',
    bankBenefits: {
      bbva: '20% reintegro los martes con BBVA (tope $10.000)',
      santander: '25% los lunes para clientes Santander Select (tope $15.000)',
      naranja: '15% los miércoles con Naranja X (tope $6.000)',
      propia: 'Jumbo Prime: envíos gratis y 20% en marcas exclusivas'
    },
    bestDays: [
      { day: 'Lunes', deal: '25% de ahorro con Santander Select (tope $15.000)', bank: 'Santander' },
      { day: 'Martes', deal: '20% de reintegro con BBVA (tope $10.000)', bank: 'BBVA' },
      { day: 'Miércoles', deal: '15% de ahorro con Naranja X', bank: 'Naranja X' }
    ]
  },
  {
    id: 'dia',
    name: 'Supermercados DÍA %',
    shortName: 'Día %',
    color: '#D61B28',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    badgeBg: 'bg-red-700 text-white',
    category: 'Cercanía',
    websiteUrl: 'https://diaonline.supermercadosdia.com.ar',
    bankBenefits: {
      bbva: '20% reintegro lunes con MODO BBVA (tope $6.000)',
      santander: '20% los miércoles con MODO Santander (tope $6.000)',
      naranja: '25% reintegro martes con Naranja X (tope $6.000)',
      propia: 'Club DÍA cupones personalizados hasta 40% off'
    },
    bestDays: [
      { day: 'Martes', deal: '25% de reintegro con Naranja X (tope $6.000)', bank: 'Naranja X' },
      { day: 'Miércoles', deal: '20% con Santander MODO', bank: 'Santander' },
      { day: 'Lunes', deal: '20% con BBVA MODO', bank: 'BBVA' }
    ]
  }
];

export const BANK_CONFIGS: Record<BankCardType, BankConfig> = {
  none: {
    id: 'none',
    name: 'Sin Promoción Bancaria',
    description: 'Efectivo / Débito habitual sin convenios de bancos',
    supermarketDiscount: {
      carrefour: { percentage: 0, maxCap: 0, dayRule: 'Todos los días' },
      coto: { percentage: 0, maxCap: 0, dayRule: 'Todos los días' },
      makro: { percentage: 0, maxCap: 0, dayRule: 'Todos los días' },
      abastecedor: { percentage: 0, maxCap: 0, dayRule: 'Todos los días' },
      disco: { percentage: 0, maxCap: 0, dayRule: 'Todos los días' },
      jumbo: { percentage: 0, maxCap: 0, dayRule: 'Todos los días' },
      dia: { percentage: 0, maxCap: 0, dayRule: 'Todos los días' }
    }
  },
  bbva: {
    id: 'bbva',
    name: 'Banco BBVA (MODO / Crédito)',
    description: '20% a 25% de reintegro en Coto (Viernes), Disco/Jumbo (Martes), Makro (Jueves)',
    supermarketDiscount: {
      carrefour: { percentage: 15, maxCap: 8000, dayRule: 'Martes con MODO BBVA' },
      coto: { percentage: 20, maxCap: 15000, dayRule: 'Viernes con BBVA (25% Premium)' },
      makro: { percentage: 20, maxCap: 12000, dayRule: 'Jueves con BBVA' },
      abastecedor: { percentage: 15, maxCap: 6000, dayRule: 'Sábados con MODO BBVA' },
      disco: { percentage: 20, maxCap: 12000, dayRule: 'Martes con BBVA' },
      jumbo: { percentage: 20, maxCap: 12000, dayRule: 'Martes con BBVA' },
      dia: { percentage: 20, maxCap: 6000, dayRule: 'Lunes con MODO BBVA' }
    }
  },
  santander: {
    id: 'santander',
    name: 'Banco Santander (Visa / Select)',
    description: '20% a 25% de ahorro en Coto (Miércoles), Carrefour (Miércoles), Jumbo (Lunes)',
    supermarketDiscount: {
      carrefour: { percentage: 20, maxCap: 10000, dayRule: 'Miércoles Santander Select' },
      coto: { percentage: 20, maxCap: 12000, dayRule: 'Miércoles con Santander' },
      makro: { percentage: 15, maxCap: 9000, dayRule: 'Martes con Visa Débito' },
      abastecedor: { percentage: 15, maxCap: 7000, dayRule: 'Viernes con Santander' },
      disco: { percentage: 20, maxCap: 12000, dayRule: 'Lunes Santander Black' },
      jumbo: { percentage: 25, maxCap: 15000, dayRule: 'Lunes Santander Select' },
      dia: { percentage: 20, maxCap: 6000, dayRule: 'Miércoles con MODO' }
    }
  },
  naranja: {
    id: 'naranja',
    name: 'Tarjeta Naranja X / Plan Z',
    description: '15% a 25% de ahorro en Coto, Día %, Carrefour y El Abastecedor',
    supermarketDiscount: {
      carrefour: { percentage: 15, maxCap: 7000, dayRule: 'Jueves con Tarjeta Naranja' },
      coto: { percentage: 20, maxCap: 10000, dayRule: 'Martes con Naranja X + Plan Z' },
      makro: { percentage: 10, maxCap: 5000, dayRule: 'Lunes con Naranja X' },
      abastecedor: { percentage: 20, maxCap: 8000, dayRule: 'Sábados con Naranja X' },
      disco: { percentage: 15, maxCap: 6000, dayRule: 'Jueves con Naranja X' },
      jumbo: { percentage: 15, maxCap: 6000, dayRule: 'Miércoles con Naranja X' },
      dia: { percentage: 25, maxCap: 8000, dayRule: 'Martes con Naranja X' }
    }
  },
  carrefour_card: {
    id: 'carrefour_card',
    name: 'Tarjeta Carrefour / Mi Carrefour',
    description: 'Descuentos exclusivos aplicados en la factura original (20% Martes, 40% perfumería)',
    supermarketDiscount: {
      carrefour: { percentage: 20, maxCap: 25000, dayRule: 'Martes Mi Carrefour / 15% diario' },
      coto: { percentage: 0, maxCap: 0, dayRule: 'No aplica en Coto' },
      makro: { percentage: 0, maxCap: 0, dayRule: 'No aplica en Makro' },
      abastecedor: { percentage: 0, maxCap: 0, dayRule: 'No aplica en El Abastecedor' },
      disco: { percentage: 0, maxCap: 0, dayRule: 'No aplica en Disco' },
      jumbo: { percentage: 0, maxCap: 0, dayRule: 'No aplica en Jumbo' },
      dia: { percentage: 0, maxCap: 0, dayRule: 'No aplica en Día' }
    }
  },
  cuentadni: {
    id: 'cuentadni',
    name: 'Cuenta DNI (Banco Provincia)',
    description: '20% a 35% en comercios bonaerenses adheridos y ferias/carnicerías',
    supermarketDiscount: {
      carrefour: { percentage: 20, maxCap: 6000, dayRule: 'Lunes y Martes especiales' },
      coto: { percentage: 20, maxCap: 6000, dayRule: 'Lunes y Martes Cuenta DNI' },
      makro: { percentage: 20, maxCap: 6000, dayRule: 'Días seleccionados' },
      abastecedor: { percentage: 25, maxCap: 8000, dayRule: 'Sábados carnicerías/almacén' },
      disco: { percentage: 20, maxCap: 6000, dayRule: 'Lunes y Martes' },
      jumbo: { percentage: 20, maxCap: 6000, dayRule: 'Lunes y Martes' },
      dia: { percentage: 20, maxCap: 6000, dayRule: 'Lunes a Viernes' }
    }
  }
};

export const INITIAL_INVOICE_PRODUCTS: InvoiceProduct[] = [
  {
    id: 'p1',
    barcode: '7790070103925',
    name: 'Relleno Tarta Espinaca Granja del Sol x 400g',
    category: 'Congelados',
    quantity: 2,
    selected: true,
    unit: 'unid',
    iconType: 'spinach',
    invoicePriceUnit: 8999.00,
    invoiceTotal: 17998.00,
    invoicePromoUnit: 8999.00,
    invoicePromoTotal: 17998.00,
    invoicePromoNote: 'Precio regular sin promo en factura',
    prices: {
      carrefour: { unitPrice: 8999, promoUnitPrice: 8999, promoDescription: 'Precio de lista Factura', inStock: true },
      coto: { unitPrice: 9449, promoUnitPrice: 6141.85, promoDescription: '35% off Coto Digital ($6.141,85 c/u)', inStock: true },
      makro: { unitPrice: 7650, promoUnitPrice: 7200, promoDescription: 'Precio mayorista x2 unid', inStock: true },
      abastecedor: { unitPrice: 7890, promoUnitPrice: 7890, promoDescription: 'Precio directo mostrador', inStock: true },
      disco: { unitPrice: 9450, promoUnitPrice: 7087, promoDescription: '2do al 50% Disco', inStock: true },
      jumbo: { unitPrice: 9550, promoUnitPrice: 7162, promoDescription: '2do al 50% Jumbo', inStock: true },
      dia: { unitPrice: 8450, promoUnitPrice: 7605, promoDescription: '10% Cupón Club Día', inStock: true }
    }
  },
  {
    id: 'p2',
    barcode: '7790070336576',
    name: 'Fideos Tallarines Don Vicente Bolsa x 500g',
    category: 'Almacén y Pastas',
    quantity: 2,
    selected: true,
    unit: 'unid',
    iconType: 'pasta',
    invoicePriceUnit: 3079.00,
    invoiceTotal: 6158.00,
    invoicePromoUnit: 2309.25,
    invoicePromoTotal: 4618.50,
    invoicePromoNote: '2do al 50% combinable (-$1.539,50)',
    prices: {
      carrefour: { unitPrice: 3079, promoUnitPrice: 2309.25, promoDescription: '2do al 50% Carrefour', inStock: true },
      coto: { unitPrice: 3950, promoUnitPrice: 2567.50, promoDescription: '2do al 70% Coto Digital ($2.567,50 c/u)', inStock: true },
      makro: { unitPrice: 2890, promoUnitPrice: 2390, promoDescription: 'Llevando 2 o más en Makro', inStock: true },
      abastecedor: { unitPrice: 2950, promoUnitPrice: 2950, promoDescription: 'Oferta almacén', inStock: true },
      disco: { unitPrice: 3950, promoUnitPrice: 2962, promoDescription: '2do al 50% Disco', inStock: true },
      jumbo: { unitPrice: 3990, promoUnitPrice: 2992, promoDescription: '2do al 50% Jumbo', inStock: true },
      dia: { unitPrice: 3450, promoUnitPrice: 2932, promoDescription: '15% Club Día', inStock: true }
    }
  },
  {
    id: 'p3',
    barcode: '7790272000831',
    name: 'Aceite Girasol Natura Aerosol x 120 cc',
    category: 'Almacén y Pastas',
    quantity: 2,
    selected: true,
    unit: 'unid',
    iconType: 'oil',
    invoicePriceUnit: 4419.00,
    invoiceTotal: 8838.00,
    invoicePromoUnit: 3314.25,
    invoicePromoTotal: 6628.50,
    invoicePromoNote: '2do al 50% Natura (-$2.209,50)',
    prices: {
      carrefour: { unitPrice: 4419, promoUnitPrice: 3314, promoDescription: '2do al 50% Carrefour', inStock: true },
      coto: { unitPrice: 4429, promoUnitPrice: 4429, promoDescription: 'Precio de lista Coto Digital (Sin promo)', inStock: true },
      makro: { unitPrice: 3790, promoUnitPrice: 3590, promoDescription: 'Mayorista Natura', inStock: true },
      abastecedor: { unitPrice: 3890, promoUnitPrice: 3890, promoDescription: 'Precio mostrador', inStock: true },
      disco: { unitPrice: 4590, promoUnitPrice: 3442, promoDescription: '2do al 50%', inStock: true },
      jumbo: { unitPrice: 4620, promoUnitPrice: 3465, promoDescription: '2do al 50%', inStock: true },
      dia: { unitPrice: 4100, promoUnitPrice: 3690, promoDescription: 'Precio Día', inStock: true }
    }
  },
  {
    id: 'p4',
    barcode: '614143298509',
    name: 'Queso Mozzarella Silvia Cilindro x 500 gr',
    category: 'Lácteos y Frescos',
    quantity: 2,
    selected: true,
    unit: 'unid',
    iconType: 'cheese',
    invoicePriceUnit: 10139.00,
    invoiceTotal: 20278.00,
    invoicePromoUnit: 7604.25,
    invoicePromoTotal: 15208.50,
    invoicePromoNote: '2do al 50% Combinable Silvia (-$5.069,50)',
    prices: {
      carrefour: { unitPrice: 10139, promoUnitPrice: 7604, promoDescription: '2do al 50% Carrefour', inStock: true },
      coto: { unitPrice: 9290, promoUnitPrice: 7432, promoDescription: '20% off Fiambrería Coto', inStock: true },
      makro: { unitPrice: 7990, promoUnitPrice: 7600, promoDescription: 'Cilindro x2 Makro', inStock: true },
      abastecedor: { unitPrice: 7490, promoUnitPrice: 6990, promoDescription: 'Especialista en quesos', inStock: true },
      disco: { unitPrice: 10450, promoUnitPrice: 7837, promoDescription: '2do al 50%', inStock: true },
      jumbo: { unitPrice: 10600, promoUnitPrice: 7950, promoDescription: '2do al 50%', inStock: true },
      dia: { unitPrice: 8990, promoUnitPrice: 8091, promoDescription: 'Club Día lácteos', inStock: true }
    }
  },
  {
    id: 'p5',
    barcode: '7790070622037',
    name: 'Tapa Pascualina Criolla La Salteña x 2 un',
    category: 'Lácteos y Frescos',
    quantity: 4,
    selected: true,
    unit: 'packs',
    iconType: 'pastry',
    invoicePriceUnit: 2575.00,
    invoiceTotal: 10300.00,
    invoicePromoUnit: 1931.25,
    invoicePromoTotal: 7725.00,
    invoicePromoNote: '2do al 50% La Salteña (-$2.575,00)',
    prices: {
      carrefour: { unitPrice: 2575, promoUnitPrice: 1931, promoDescription: '2do al 50% Carrefour', inStock: true },
      coto: { unitPrice: 2390, promoUnitPrice: 1553, promoDescription: '2do al 70% Coto tapas', inStock: true },
      makro: { unitPrice: 2090, promoUnitPrice: 1890, promoDescription: 'Pack x4 unidades', inStock: true },
      abastecedor: { unitPrice: 2190, promoUnitPrice: 2190, promoDescription: 'Precio fresco diario', inStock: true },
      disco: { unitPrice: 2690, promoUnitPrice: 2017, promoDescription: '2do al 50%', inStock: true },
      jumbo: { unitPrice: 2750, promoUnitPrice: 2062, promoDescription: '2do al 50%', inStock: true },
      dia: { unitPrice: 2290, promoUnitPrice: 1946, promoDescription: 'Oferta Pascualina', inStock: true }
    }
  },
  {
    id: 'p6',
    barcode: '7500435219655',
    name: 'Espuma de Afeitar Gillette Foamy Sensitive 322 ml',
    category: 'Perfumería e Higiene',
    quantity: 1,
    selected: true,
    unit: 'unid',
    iconType: 'shaving',
    invoicePriceUnit: 15929.00,
    invoiceTotal: 15929.00,
    invoicePromoUnit: 12743.20,
    invoicePromoTotal: 12743.20,
    invoicePromoNote: 'Precio de góndola actual Carrefour: $15.929 (20% con Mi Carrefour: $12.743,20)',
    prices: {
      carrefour: { unitPrice: 15929, promoUnitPrice: 15929, promoDescription: 'Precio góndola online ($12.743 c/ Tarjeta)', inStock: true },
      coto: { unitPrice: 15450, promoUnitPrice: 12360, promoDescription: '20% Comunidad Perfumería', inStock: true },
      makro: { unitPrice: 13990, promoUnitPrice: 13490, promoDescription: 'Precio mayorista bulto', inStock: true },
      abastecedor: { unitPrice: 14800, promoUnitPrice: 14800, promoDescription: 'Precio lista perfumería', inStock: true },
      disco: { unitPrice: 16100, promoUnitPrice: 12880, promoDescription: '20% con MODO', inStock: true },
      jumbo: { unitPrice: 16250, promoUnitPrice: 13000, promoDescription: '20% con MODO', inStock: true },
      dia: { unitPrice: 14900, promoUnitPrice: 13410, promoDescription: 'Club Día', inStock: true }
    }
  },
  {
    id: 'p7',
    barcode: '75079444',
    name: 'Antitranspirante Masc Crema Clinical Soft Dove',
    category: 'Perfumería e Higiene',
    quantity: 1,
    selected: true,
    unit: 'unid',
    iconType: 'deodorant',
    invoicePriceUnit: 15195.00,
    invoiceTotal: 15195.00,
    invoicePromoUnit: 7995.80,
    invoicePromoTotal: 7995.80,
    invoicePromoNote: '40% Off Tarjeta Carrefour Digital (-$7.199,20)',
    prices: {
      carrefour: { unitPrice: 15195, promoUnitPrice: 7996, promoDescription: '40% Tarjeta Carrefour digital', inStock: true },
      coto: { unitPrice: 14200, promoUnitPrice: 9940, promoDescription: '30% Coto Digital Perfumería', inStock: true },
      makro: { unitPrice: 12900, promoUnitPrice: 11800, promoDescription: 'Precio mayorista x unidad', inStock: true },
      abastecedor: { unitPrice: 13950, promoUnitPrice: 13950, promoDescription: 'Precio góndola', inStock: true },
      disco: { unitPrice: 15300, promoUnitPrice: 10710, promoDescription: '30% en Clinical', inStock: true },
      jumbo: { unitPrice: 15450, promoUnitPrice: 10815, promoDescription: '30% en Clinical', inStock: true },
      dia: { unitPrice: 13900, promoUnitPrice: 11815, promoDescription: '15% Descuento Día', inStock: true }
    }
  },
  {
    id: 'p8',
    barcode: '7790580146115',
    name: 'Puré de Tomate Arcor Brik x 520 grs',
    category: 'Almacén y Pastas',
    quantity: 6,
    selected: true,
    unit: 'unid',
    iconType: 'tomato',
    invoicePriceUnit: 1110.00,
    invoiceTotal: 6660.00,
    invoicePromoUnit: 832.50,
    invoicePromoTotal: 4995.00,
    invoicePromoNote: '2do al 50% Arcor (-$1.665,00)',
    prices: {
      carrefour: { unitPrice: 1110, promoUnitPrice: 832, promoDescription: '2do al 50% Carrefour', inStock: true },
      coto: { unitPrice: 980, promoUnitPrice: 784, promoDescription: 'Llevando 6 o más en Coto', inStock: true },
      makro: { unitPrice: 790, promoUnitPrice: 740, promoDescription: 'Bulto cerrado x12 Makro', inStock: true },
      abastecedor: { unitPrice: 870, promoUnitPrice: 870, promoDescription: 'Precio promo brik', inStock: true },
      disco: { unitPrice: 1150, promoUnitPrice: 862, promoDescription: '2do al 50%', inStock: true },
      jumbo: { unitPrice: 1180, promoUnitPrice: 885, promoDescription: '2do al 50%', inStock: true },
      dia: { unitPrice: 940, promoUnitPrice: 799, promoDescription: 'Llevando 4 o más', inStock: true }
    }
  },
  {
    id: 'p9',
    barcode: '7798343751484',
    name: 'Galletitas Cacao Chocolate Integra 72 gr',
    category: 'Snacks y Galletitas',
    quantity: 4,
    selected: true,
    unit: 'unid',
    iconType: 'cookies',
    invoicePriceUnit: 1800.00,
    invoiceTotal: 7200.00,
    invoicePromoUnit: 1800.00,
    invoicePromoTotal: 7200.00,
    invoicePromoNote: 'Precio regular factura',
    prices: {
      carrefour: { unitPrice: 1800, promoUnitPrice: 1800, promoDescription: 'Sin promo', inStock: true },
      coto: { unitPrice: 1650, promoUnitPrice: 1237, promoDescription: 'Promo 4x3 en galletitas Integra', inStock: true },
      makro: { unitPrice: 1450, promoUnitPrice: 1350, promoDescription: 'Display x4 unidades', inStock: true },
      abastecedor: { unitPrice: 1590, promoUnitPrice: 1590, promoDescription: 'Precio almacén', inStock: true },
      disco: { unitPrice: 1850, promoUnitPrice: 1387, promoDescription: '2do al 50%', inStock: true },
      jumbo: { unitPrice: 1890, promoUnitPrice: 1417, promoDescription: '2do al 50%', inStock: true },
      dia: { unitPrice: 1690, promoUnitPrice: 1521, promoDescription: '10% off Club Día', inStock: true }
    }
  },
  {
    id: 'p10',
    barcode: '7798338290035',
    name: 'Leche Liviana 1% Fortificada Las 3 Niñas x 1L',
    category: 'Lácteos y Frescos',
    quantity: 24,
    selected: true,
    unit: 'litros (pack x24)',
    iconType: 'milk',
    invoicePriceUnit: 2610.00,
    invoiceTotal: 62640.00,
    invoicePromoUnit: 1957.50,
    invoicePromoTotal: 46980.00,
    invoicePromoNote: '2do al 50% Mi Carrefour (-$15.660,00)',
    prices: {
      carrefour: { unitPrice: 2610, promoUnitPrice: 1958, promoDescription: '2do al 50% Mi Carrefour', inStock: true },
      coto: { unitPrice: 2450, promoUnitPrice: 1715, promoDescription: '2do al 70% Las 3 Niñas Coto', inStock: true },
      makro: { unitPrice: 1890, promoUnitPrice: 1790, promoDescription: 'Bulto cerrado caja x24 Makro', inStock: true },
      abastecedor: { unitPrice: 2290, promoUnitPrice: 2190, promoDescription: 'Llevando caja cerrada', inStock: true },
      disco: { unitPrice: 2750, promoUnitPrice: 2062, promoDescription: '2do al 50%', inStock: true },
      jumbo: { unitPrice: 2790, promoUnitPrice: 2092, promoDescription: '2do al 50%', inStock: true },
      dia: { unitPrice: 2350, promoUnitPrice: 1997, promoDescription: 'Descuento x pack', inStock: true }
    }
  },
  {
    id: 'p11',
    barcode: '7791337010017',
    name: 'Yogur Natural Sin Endulzar Yogurísimo x 190g',
    category: 'Lácteos y Frescos',
    quantity: 2,
    selected: true,
    unit: 'potes',
    iconType: 'yogurt',
    invoicePriceUnit: 4345.00,
    invoiceTotal: 8690.00,
    invoicePromoUnit: 2824.25,
    invoicePromoTotal: 5648.50,
    invoicePromoNote: '2do al 70% La Serenísima (-$3.041,50)',
    prices: {
      carrefour: { unitPrice: 4345, promoUnitPrice: 2824.25, promoDescription: '2do al 70% Factura ($2.824 c/u)', inStock: true },
      coto: { unitPrice: 5170, promoUnitPrice: 3360.50, promoDescription: '2do al 70% Coto Digital ($3.360,50 c/u)', inStock: true },
      makro: { unitPrice: 4290, promoUnitPrice: 3490, promoDescription: 'Llevando 2 unid ($3.490 c/u)', inStock: true },
      abastecedor: { unitPrice: 4390, promoUnitPrice: 3790, promoDescription: 'Oferta mostrador ($3.790 c/u)', inStock: true },
      disco: { unitPrice: 5290, promoUnitPrice: 3703, promoDescription: '2do al 60% Disco', inStock: true },
      jumbo: { unitPrice: 5350, promoUnitPrice: 3745, promoDescription: '2do al 60% Jumbo', inStock: true },
      dia: { unitPrice: 4590, promoUnitPrice: 3901, promoDescription: '15% Club Día ($3.901 c/u)', inStock: true }
    }
  },
  {
    id: 'p12',
    barcode: '7794520869164',
    name: 'Papas Fritas Corte Americano Krachitos x 250g',
    category: 'Snacks y Galletitas',
    quantity: 2,
    selected: true,
    unit: 'bolsas',
    iconType: 'chips',
    invoicePriceUnit: 6239.00,
    invoiceTotal: 12478.00,
    invoicePromoUnit: 4679.25,
    invoicePromoTotal: 9358.50,
    invoicePromoNote: '2do al 50% Krachitos (-$3.119,50)',
    prices: {
      carrefour: { unitPrice: 6239, promoUnitPrice: 4679, promoDescription: '2do al 50% Carrefour', inStock: true },
      coto: { unitPrice: 5790, promoUnitPrice: 4342, promoDescription: '2do al 50% Coto Snacks', inStock: true },
      makro: { unitPrice: 4890, promoUnitPrice: 4600, promoDescription: 'Pack snacks mayorista', inStock: true },
      abastecedor: { unitPrice: 5190, promoUnitPrice: 5190, promoDescription: 'Oferta semanal', inStock: true },
      disco: { unitPrice: 6390, promoUnitPrice: 4792, promoDescription: '2do al 50%', inStock: true },
      jumbo: { unitPrice: 6490, promoUnitPrice: 4867, promoDescription: '2do al 50%', inStock: true },
      dia: { unitPrice: 5590, promoUnitPrice: 4751, promoDescription: '15% off Snacks', inStock: true }
    }
  },
  {
    id: 'p13',
    barcode: '7790070036285',
    name: 'Espinaca Congelada Granja del Sol Bolsa x 500g',
    category: 'Congelados',
    quantity: 1,
    selected: true,
    unit: 'unid',
    iconType: 'spinach',
    invoicePriceUnit: 8870.00,
    invoiceTotal: 8870.00,
    invoicePromoUnit: 5765.50,
    invoicePromoTotal: 5765.50,
    invoicePromoNote: '35% Off Tarjeta Carrefour (-$3.104,50)',
    prices: {
      carrefour: { unitPrice: 8870, promoUnitPrice: 5765, promoDescription: '35% Tarjeta Carrefour', inStock: true },
      coto: { unitPrice: 7850, promoUnitPrice: 6280, promoDescription: '20% off Granja del Sol Coto', inStock: true },
      makro: { unitPrice: 6990, promoUnitPrice: 6690, promoDescription: 'Congelados Makro', inStock: true },
      abastecedor: { unitPrice: 7390, promoUnitPrice: 7390, promoDescription: 'Precio congelados', inStock: true },
      disco: { unitPrice: 8950, promoUnitPrice: 6712, promoDescription: '2do al 50%', inStock: true },
      jumbo: { unitPrice: 9100, promoUnitPrice: 6825, promoDescription: '2do al 50%', inStock: true },
      dia: { unitPrice: 7750, promoUnitPrice: 6975, promoDescription: '10% Club Día', inStock: true }
    }
  },
  {
    id: 'p14',
    barcode: '7791293049502',
    name: 'Desodorante Aerosol Rexona x 150 CC',
    category: 'Perfumería e Higiene',
    quantity: 6,
    selected: true,
    unit: 'unid',
    iconType: 'deodorant',
    invoicePriceUnit: 4559.00,
    invoiceTotal: 27354.00,
    invoicePromoUnit: 3419.25,
    invoicePromoTotal: 20515.50,
    invoicePromoNote: '2do al 50% Rexona (-$6.838,50)',
    prices: {
      carrefour: { unitPrice: 4559, promoUnitPrice: 3419, promoDescription: '2do al 50% Carrefour', inStock: true },
      coto: { unitPrice: 4190, promoUnitPrice: 2723, promoDescription: '2do al 70% Rexona Coto', inStock: true },
      makro: { unitPrice: 3590, promoUnitPrice: 3350, promoDescription: 'Pack x6 desodorantes Makro', inStock: true },
      abastecedor: { unitPrice: 3890, promoUnitPrice: 3890, promoDescription: 'Precio perfumería', inStock: true },
      disco: { unitPrice: 4690, promoUnitPrice: 3283, promoDescription: '2do al 60%', inStock: true },
      jumbo: { unitPrice: 4750, promoUnitPrice: 3325, promoDescription: '2do al 60%', inStock: true },
      dia: { unitPrice: 4090, promoUnitPrice: 3476, promoDescription: 'Promo Rexona', inStock: true }
    }
  },
  {
    id: 'p15',
    barcode: '7790070336552',
    name: 'Fideos Cinta Caserito Don Vicente Bolsa x 500g',
    category: 'Almacén y Pastas',
    quantity: 4,
    selected: true,
    unit: 'unid',
    iconType: 'pasta',
    invoicePriceUnit: 3079.00,
    invoiceTotal: 12316.00,
    invoicePromoUnit: 2309.25,
    invoicePromoTotal: 9237.00,
    invoicePromoNote: '2do al 50% Don Vicente (-$3.079,00)',
    prices: {
      carrefour: { unitPrice: 3079, promoUnitPrice: 2309, promoDescription: '2do al 50% Carrefour', inStock: true },
      coto: { unitPrice: 2850, promoUnitPrice: 1852, promoDescription: '2do al 70% Coto Pastas', inStock: true },
      makro: { unitPrice: 2390, promoUnitPrice: 2190, promoDescription: 'Precio por 4 unidades', inStock: true },
      abastecedor: { unitPrice: 2550, promoUnitPrice: 2550, promoDescription: 'Almacén fideos', inStock: true },
      disco: { unitPrice: 3200, promoUnitPrice: 2400, promoDescription: '2do al 50%', inStock: true },
      jumbo: { unitPrice: 3250, promoUnitPrice: 2437, promoDescription: '2do al 50%', inStock: true },
      dia: { unitPrice: 2890, promoUnitPrice: 2450, promoDescription: 'Oferta Día', inStock: true }
    }
  }
];

export const INVOICE_METADATA = {
  storeName: 'Carrefour INC S.A.',
  invoiceType: 'FACTURA B N° 20356-06848012',
  branch: 'Cuyo 3323 (1640), Martínez, Buenos Aires',
  date: '17/06/2026',
  client: 'GALLARDO MATIAS',
  clientAddress: 'J. Battle y Ordóñez 1518, Hurlingham (1688), Buenos Aires',
  dni: '26411482',
  subtotalGross: 241355.00,
  discountsSum: 64464.50,
  totalPaid: 176890.50,
  ivaContenido: 29399.19,
  paymentMethod: 'Tarjeta Carrefour Mastercard (1 cuota)'
};
