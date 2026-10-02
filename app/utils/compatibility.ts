/**
 * NexaDesk Compatibility Rules Engine
 * Centralised evaluation conforming to DESIGN.md Section 6 and tests/compatibility.test.mjs
 */

export interface DeviceProfile {
  code: string;
  label: string;
  subTitle?: string;
  operating_system: string[] | string;
  host_connector: 'USB-C' | 'USB-A' | string;
  usb_c_video_support?: boolean;
  video_support?: boolean;
  required_charging_watts?: number;
  required_charging_power?: number;
}

export interface DockItem {
  id: string;
  title: string;
  handle?: string;
  product_role?: string;
  host_connector: string;
  supported_os?: string[] | string;
  supported_operating_systems?: string[] | string;
  charging_output_watts?: number;
  dock_charging_output?: number;
  video_outputs?: string[] | string;
  dock_video_outputs?: string[] | string;
  price?: string;
  availableForSale?: boolean;
  inventoryQty?: number;
}

export interface MonitorItem {
  id: string;
  title: string;
  handle?: string;
  product_role?: string;
  video_inputs?: string[] | string;
  monitor_video_inputs?: string[] | string;
  price?: string;
  availableForSale?: boolean;
  inventoryQty?: number;
}

export interface CompatibilityEvaluation {
  status: 'compatible' | 'not-compatible' | 'not-confirmed';
  compatible: boolean;
  reasons: string[];
  reason?: string;
}

/**
 * Normalise list of strings
 */
export function normalizeList(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
      }
    } catch {
      // not JSON
    }
    return val.split(/[,;\n]/).map((item) => item.trim().toLowerCase()).filter(Boolean);
  }
  return [String(val).trim().toLowerCase()];
}

/**
 * Evaluates full dock compatibility against a device profile.
 */
export function evaluateDockCompatibility(
  profile: DeviceProfile | null,
  dock: DockItem | null,
): CompatibilityEvaluation {
  if (!profile || !dock) {
    return {
      status: 'not-confirmed',
      compatible: false,
      reasons: ['Missing profile or product data.'],
      reason: 'Missing profile or product data.',
    };
  }

  // Extract profile attributes
  const profileConnector = String(profile.host_connector || '').trim().toLowerCase();
  const profileOS = normalizeList(profile.operating_system);
  const profileWatts = Number(profile.required_charging_watts ?? profile.required_charging_power ?? 0);
  const profileVideo =
    profile.usb_c_video_support !== undefined
      ? Boolean(profile.usb_c_video_support)
      : profile.video_support !== undefined
      ? Boolean(profile.video_support)
      : true;

  // Extract dock attributes
  const dockConnector = String(dock.host_connector || '').trim().toLowerCase();
  const dockOS = normalizeList(dock.supported_os || dock.supported_operating_systems);
  const dockWatts = Number(dock.charging_output_watts ?? dock.dock_charging_output ?? 0);
  const dockOutputs = normalizeList(dock.video_outputs || dock.dock_video_outputs);
  const role = dock.product_role || 'dock';

  // Check missing data
  if (role !== 'hub-only' && (!dockConnector || dockOS.length === 0 || dockOutputs.length === 0)) {
    return {
      status: 'not-confirmed',
      compatible: false,
      reasons: ['Missing required specifications. Contact support.'],
      reason: 'Missing required specifications. Contact support.',
    };
  }

  const reasons: string[] = [];

  // Rule 1: Video support check
  if (!profileVideo) {
    reasons.push(
      'Device profile does not support USB-C video output. Browse individual products.',
    );
  }

  // Rule 6: Exclude hub-only
  if (role === 'hub-only') {
    reasons.push('Excluded: Hub-only device without dedicated display output.');
  }

  // Rule 2: Host connector match
  if (profileConnector && dockConnector && profileConnector !== dockConnector) {
    reasons.push(
      `Excluded: Connector mismatch (device requires ${profile.host_connector}, dock has ${dock.host_connector}).`,
    );
  }

  // Rule 3: Operating system compatibility
  const dockSupportsAll =
    dockOS.includes('both') ||
    dockOS.includes('universal') ||
    (dockOS.includes('windows') && dockOS.includes('macos'));
  const osMatch = dockSupportsAll || profileOS.some((os) => dockOS.includes(os));
  if (!osMatch) {
    const requiredOS = profileOS.join(', ');
    reasons.push(
      `Excluded: OS incompatibility (device requires ${requiredOS || 'supported OS'}).`,
    );
  }

  // Rule 4: Charging wattage capacity
  if (dockWatts < profileWatts) {
    reasons.push(
      `Excluded: ${dockWatts}W charging output (requires ${profileWatts}W minimum).`,
    );
  }

  // Rule 5: Video outputs count >= 1
  if (dockOutputs.length === 0 && role !== 'hub-only') {
    reasons.push('Excluded: Dock does not have video outputs.');
  }

  if (reasons.length === 0) {
    return {
      status: 'compatible',
      compatible: true,
      reasons: [
        `Compatible with ${profile.label || profile.code}: ${dockWatts}W charging, ${dockOutputs
          .map((o) => o.toUpperCase())
          .join(', ')} outputs`,
      ],
      reason: `Compatible with ${profile.label || profile.code}`,
    };
  }

  return {
    status: 'not-compatible',
    compatible: false,
    reasons,
    reason: reasons[0],
  };
}

export function checkDockCompatibility(
  profile: DeviceProfile,
  dock: DockItem,
): {compatible: boolean; reason?: string} {
  const result = evaluateDockCompatibility(profile, dock);
  return {
    compatible: result.compatible,
    reason: result.reason,
  };
}

export function isDockCompatible(profile: DeviceProfile, dock: DockItem): boolean {
  return evaluateDockCompatibility(profile, dock).compatible;
}

/**
 * Checks whether a Monitor is compatible with a selected Dock.
 */
export function evaluateMonitorCompatibility(
  dock: DockItem | null,
  monitor: MonitorItem | null,
): CompatibilityEvaluation {
  if (!dock || !monitor) {
    return {
      status: 'not-confirmed',
      compatible: false,
      reasons: ['Missing dock or monitor data.'],
      reason: 'Missing dock or monitor data.',
    };
  }

  const dockOutputs = normalizeList(dock.video_outputs || dock.dock_video_outputs);
  const monitorInputs = normalizeList(monitor.video_inputs || monitor.monitor_video_inputs);

  if (dockOutputs.length === 0 || monitorInputs.length === 0) {
    return {
      status: 'not-confirmed',
      compatible: false,
      reasons: ['Missing video specification data.'],
      reason: 'Missing video specification data.',
    };
  }

  const intersection = monitorInputs.filter((input) => dockOutputs.includes(input));

  if (intersection.length > 0) {
    return {
      status: 'compatible',
      compatible: true,
      reasons: [`Compatible via ${intersection.map((p) => p.toUpperCase()).join(' & ')}.`],
      reason: `Matches dock video output via ${intersection.map((p) => p.toUpperCase()).join(' & ')}`,
    };
  }

  const requiredPorts = monitorInputs.map((p) => p.toUpperCase()).join(' or ');
  const providedPorts = dockOutputs.map((p) => p.toUpperCase()).join(', ');
  const mismatchReason = `Incompatible video interface: Monitor requires ${requiredPorts}, but dock provides ${providedPorts}.`;

  return {
    status: 'not-compatible',
    compatible: false,
    reasons: [mismatchReason],
    reason: mismatchReason,
  };
}

export function checkMonitorCompatibility(
  dock: DockItem,
  monitor: MonitorItem,
): {compatible: boolean; reason?: string} {
  const result = evaluateMonitorCompatibility(dock, monitor);
  return {
    compatible: result.compatible,
    reason: result.reason,
  };
}

export function isMonitorCompatible(dock: DockItem, monitor: MonitorItem): boolean {
  return evaluateMonitorCompatibility(dock, monitor).compatible;
}
