/**
 * NexaDesk Master Products and Device Profiles Catalogue
 * Fixtures based on DESIGN.md Section 5.1 & 5.2 and shopify export
 */

export interface DeviceProfile {
  code: string;
  label: string;
  subTitle: string;
  operating_system: string[];
  host_connector: 'USB-C' | 'USB-A';
  usb_c_video_support: boolean;
  required_charging_watts: number;
  tag: string;
  description: string;
}

export interface CatalogueDock {
  id: string;
  handle: string;
  variantId: string;
  title: string;
  product_role: 'dock' | 'hub-only';
  host_connector: 'USB-C' | 'USB-A';
  supported_os: string[];
  charging_output_watts: number;
  video_outputs: string[];
  price: string;
  availableForSale: boolean;
  inventoryQty: number;
  description: string;
  tag: string;
}

export interface CatalogueMonitor {
  id: string;
  handle: string;
  variantId: string;
  title: string;
  product_role: 'monitor';
  video_inputs: string[];
  price: string;
  resolution: string;
  screen_size: string;
  availableForSale: boolean;
  inventoryQty: number;
  description: string;
  tag: string;
}

export interface CatalogueAccessory {
  id: string;
  handle: string;
  variantId: string;
  title: string;
  product_role: 'keyboard' | 'mouse' | 'stand';
  price: string;
  availableForSale: boolean;
  inventoryQty: number;
  description: string;
  category: string;
  tag: string;
}

export const DEVICE_PROFILES: DeviceProfile[] = [
  {
    code: 'P1',
    label: 'Studio 65 (Windows)',
    subTitle: 'Dell, Lenovo, HP, Surface Laptop',
    operating_system: ['Windows'],
    host_connector: 'USB-C',
    usb_c_video_support: true,
    required_charging_watts: 65,
    tag: 'Standard Business PC',
    description: 'Everyday Windows laptops with USB-C. Charges up to 65W with full multi-screen support.',
  },
  {
    code: 'P2',
    label: 'Studio 100 (Windows)',
    subTitle: 'Gaming PC, Workstation & Creative Laptop',
    operating_system: ['Windows'],
    host_connector: 'USB-C',
    usb_c_video_support: true,
    required_charging_watts: 100,
    tag: '100W High Power Workstation',
    description: 'High-performance laptops requiring full 100W Power Delivery to stay charged under heavy compute load.',
  },
  {
    code: 'P3',
    label: 'Creator 65 (macOS)',
    subTitle: 'MacBook Air, MacBook Pro, Mac mini (M1/M2/M3/M4)',
    operating_system: ['macOS'],
    host_connector: 'USB-C',
    usb_c_video_support: true,
    required_charging_watts: 65,
    tag: 'Apple Official macOS',
    description: 'Apple Silicon or Intel Mac with Thunderbolt / USB-C ports. Fast one-cable charging and dual display.',
  },
  {
    code: 'P4',
    label: 'Classic A (Windows)',
    subTitle: 'Legacy PC with rectangular USB-A port only',
    operating_system: ['Windows'],
    host_connector: 'USB-A',
    usb_c_video_support: false,
    required_charging_watts: 0,
    tag: 'Classic USB-A (No Video)',
    description: 'Older machines with traditional rectangular USB ports. Connects data and peripherals (no native video).',
  },
];

export const CATALOGUE_DOCKS: CatalogueDock[] = [
  {
    id: 'gid://shopify/Product/D1',
    handle: 'd1-link-65',
    variantId: 'gid://shopify/ProductVariant/D1-LINK-65-001',
    title: 'D1 Link 65 Standard Dock',
    product_role: 'dock',
    host_connector: 'USB-C',
    supported_os: ['Windows', 'macOS'],
    charging_output_watts: 65,
    video_outputs: ['HDMI'],
    price: '99.00',
    availableForSale: true,
    inventoryQty: 10,
    description: 'Reliable desktop dock with up to 65W charging and crisp 4K HDMI video output for single screens.',
    tag: 'Best for MacBook Air & 65W PC',
  },
  {
    id: 'gid://shopify/Product/D2',
    handle: 'd2-link-100',
    variantId: 'gid://shopify/ProductVariant/D2-LINK-100-SLV',
    title: 'D2 Link 100 Dual-Screen Flagship Dock',
    product_role: 'dock',
    host_connector: 'USB-C',
    supported_os: ['Windows', 'macOS'],
    charging_output_watts: 100,
    video_outputs: ['HDMI', 'DisplayPort'],
    price: '120.00',
    availableForSale: true,
    inventoryQty: 5,
    description: 'Our top-tier dock. Sustained 100W Power Delivery and dual video feeds (HDMI + DP) for power users.',
    tag: 'Flagship Dual-Screen Pick',
  },
  {
    id: 'gid://shopify/Product/D3',
    handle: 'd3-pro-100',
    variantId: 'gid://shopify/ProductVariant/D3-PRO-100-001',
    title: 'D3 Pro 100 High-Speed Workstation Dock',
    product_role: 'dock',
    host_connector: 'USB-C',
    supported_os: ['Windows'],
    charging_output_watts: 100,
    video_outputs: ['DisplayPort'],
    price: '149.00',
    availableForSale: true,
    inventoryQty: 8,
    description: 'Built exclusively for demanding Windows workstations requiring enterprise DisplayPort & 100W PD.',
    tag: 'Windows CAD & Heavy Workstation',
  },
  {
    id: 'gid://shopify/Product/D4',
    handle: 'd4-connect-a',
    variantId: 'gid://shopify/ProductVariant/D4-CONN-A-001',
    title: 'D4 Connect A Legacy Peripheral Hub',
    product_role: 'hub-only',
    host_connector: 'USB-A',
    supported_os: ['Windows', 'macOS'],
    charging_output_watts: 0,
    video_outputs: [],
    price: '59.00',
    availableForSale: true,
    inventoryQty: 3,
    description: 'Legacy USB-A peripheral hub for keyboard, mouse, and storage. Does not support video displays.',
    tag: 'USB-A Data Hub Only',
  },
];

export const CATALOGUE_MONITORS: CatalogueMonitor[] = [
  {
    id: 'gid://shopify/Product/M1',
    handle: 'm1-hdmi-27',
    variantId: 'gid://shopify/ProductVariant/M1-HDMI-27-001',
    title: 'M1 27-inch HDMI Productivity Monitor',
    product_role: 'monitor',
    video_inputs: ['HDMI'],
    price: '145.00',
    resolution: '4K IPS (3840 x 2160)',
    screen_size: '27-inch',
    availableForSale: true,
    inventoryQty: 2,
    description: 'Crystal-clear 27" IPS screen with vibrant colour and native HDMI input. Anti-glare eye protection.',
    tag: 'HDMI Ready',
  },
  {
    id: 'gid://shopify/Product/M2',
    handle: 'm2-dp-27',
    variantId: 'gid://shopify/ProductVariant/M2-DP-27-001',
    title: 'M2 27-inch DisplayPort High-Refresh Monitor',
    product_role: 'monitor',
    video_inputs: ['DisplayPort'],
    price: '189.00',
    resolution: '4K 144Hz (3840 x 2160)',
    screen_size: '27-inch',
    availableForSale: true,
    inventoryQty: 6,
    description: 'Silky smooth 144Hz refresh rate with dedicated DisplayPort input, tailored for CAD, 3D design, and coding.',
    tag: 'DisplayPort Exclusive',
  },
  {
    id: 'gid://shopify/Product/M3',
    handle: 'm3-usb-c-27',
    variantId: 'gid://shopify/ProductVariant/M3-USB-C-27-001',
    title: 'M3 27-inch Universal Dual-Input Monitor',
    product_role: 'monitor',
    video_inputs: ['HDMI', 'DisplayPort'],
    price: '250.00',
    resolution: '5K Retina Clarity (5120 x 2880)',
    screen_size: '27-inch',
    availableForSale: true,
    inventoryQty: 4,
    description: 'Universal compatibility with both HDMI and DisplayPort inputs. Matches seamlessly with any dock output.',
    tag: 'Universal HDMI & DP',
  },
  {
    id: 'gid://shopify/Product/M4',
    handle: 'm4-portable',
    variantId: 'gid://shopify/ProductVariant/M4-PORT-USB-C-001',
    title: 'M4 15.6-inch Portable Second Screen',
    product_role: 'monitor',
    video_inputs: ['DisplayPort'],
    price: '199.00',
    resolution: 'FHD IPS (1920 x 1080)',
    screen_size: '15.6-inch',
    availableForSale: true,
    inventoryQty: 5,
    description: 'Ultra-thin, lightweight companion screen designed for flexible hybrid and remote workspaces.',
    tag: 'Compact Travel Screen',
  },
];

export const CATALOGUE_ACCESSORIES: CatalogueAccessory[] = [
  {
    id: 'gid://shopify/Product/S1',
    handle: 's1-fixed-tilt',
    variantId: 'gid://shopify/ProductVariant/ST-FIXD-001',
    title: 'S1 Fixed Tilt Aluminium Laptop Stand',
    product_role: 'stand',
    price: '35.00',
    availableForSale: true,
    inventoryQty: 8,
    description: 'Minimalist brushed aluminium stand raising your laptop screen to comfortable eye level.',
    category: 'Stands',
    tag: 'Ergonomic Essential',
  },
  {
    id: 'gid://shopify/Product/S2',
    handle: 's2-adjustable',
    variantId: 'gid://shopify/ProductVariant/ST-ADJU-001',
    title: 'S2 Height-Adjustable Ergonomic Stand',
    product_role: 'stand',
    price: '49.00',
    availableForSale: true,
    inventoryQty: 6,
    description: 'Precision dual-hinge riser with heat dissipation cutouts and multi-height adjustment.',
    category: 'Stands',
    tag: 'Multi-Height Tilt',
  },
  {
    id: 'gid://shopify/Product/K1',
    handle: 'k1-mechanical',
    variantId: 'gid://shopify/ProductVariant/KB-MECH-001',
    title: 'K1 Precision Mechanical Keyboard',
    product_role: 'keyboard',
    price: '69.00',
    availableForSale: true,
    inventoryQty: 10,
    description: 'Smooth tactile switches with universal Mac & Windows keycaps and anodised top plate.',
    category: 'Keyboards',
    tag: 'Tactile Typing',
  },
  {
    id: 'gid://shopify/Product/K2',
    handle: 'k2-wireless',
    variantId: 'gid://shopify/ProductVariant/KB-WIRE-001',
    title: 'K2 Slim Wireless Multi-Device Keyboard',
    product_role: 'keyboard',
    price: '49.00',
    availableForSale: true,
    inventoryQty: 12,
    description: 'Whisper-quiet scissor switches with 3-device Bluetooth switching and multi-month battery life.',
    category: 'Keyboards',
    tag: 'Ultra-Quiet Wireless',
  },
  {
    id: 'gid://shopify/Product/M-1',
    handle: 'm-1-optical',
    variantId: 'gid://shopify/ProductVariant/MO-OPTI-BLK',
    title: 'M-1 Silent Precision Optical Mouse',
    product_role: 'mouse',
    price: '29.00',
    availableForSale: true,
    inventoryQty: 8,
    description: 'Silent-click optical sensor mouse with smooth glide pads and contoured palm comfort.',
    category: 'Mice',
    tag: 'Silent Click',
  },
  {
    id: 'gid://shopify/Product/M-2',
    handle: 'm-2-ergonomic',
    variantId: 'gid://shopify/ProductVariant/MO-ERGO-001',
    title: 'M-2 Ergonomic Vertical Handshake Mouse',
    product_role: 'mouse',
    price: '39.00',
    availableForSale: true,
    inventoryQty: 7,
    description: 'Natural 57-degree handshake grip preventing forearm twisting and repetitive wrist strain.',
    category: 'Mice',
    tag: 'Wrist-Pain Relief',
  },
];
