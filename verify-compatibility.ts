import {
  checkDockCompatibility,
  checkMonitorCompatibility,
  DeviceProfile,
  Dock,
  Monitor,
} from './app/utils/compatibility';


// Fixture Profiles
const P1: DeviceProfile = {
  code: 'P1',
  label: 'Studio 65',
  operating_system: 'Windows',
  host_connector: 'USB-C',
  video_support: true,
  required_charging_power: 65,
};

const P2: DeviceProfile = {
  code: 'P2',
  label: 'Studio 100',
  operating_system: 'Windows',
  host_connector: 'USB-C',
  video_support: true,
  required_charging_power: 100,
};

const P3: DeviceProfile = {
  code: 'P3',
  label: 'Creator 65',
  operating_system: 'macOS',
  host_connector: 'USB-C',
  video_support: true,
  required_charging_power: 65,
};

const P4: DeviceProfile = {
  code: 'P4',
  label: 'Classic A',
  operating_system: 'Windows',
  host_connector: 'USB-A',
  video_support: false,
  required_charging_power: 0,
};

// Fixture Docks
const D1: Dock = {
  id: 'D1',
  title: 'Link 65',
  handle: 'link-65',
  host_connector: 'USB-C',
  supported_operating_systems: ['Windows', 'macOS'],
  dock_charging_output: 65,
  dock_video_outputs: ['HDMI'],
};

const D2: Dock = {
  id: 'D2',
  title: 'Link 100',
  handle: 'link-100',
  host_connector: 'USB-C',
  supported_operating_systems: ['Windows', 'macOS'],
  dock_charging_output: 100,
  dock_video_outputs: ['HDMI', 'DisplayPort'],
};

const D3: Dock = {
  id: 'D3',
  title: 'Pro 100',
  handle: 'pro-100',
  host_connector: 'USB-C',
  supported_operating_systems: ['Windows'],
  dock_charging_output: 100,
  dock_video_outputs: ['DisplayPort'],
};

const D4: Dock = {
  id: 'D4',
  title: 'Connect A',
  handle: 'connect-a',
  host_connector: 'USB-A',
  supported_operating_systems: ['Windows', 'macOS'],
  dock_charging_output: 0,
  dock_video_outputs: [],
};

// Fixture Monitors
const M1: Monitor = {
  id: 'M1',
  title: 'Monitor M1',
  handle: 'monitor-m1',
  monitor_video_inputs: ['HDMI'],
};

const M2: Monitor = {
  id: 'M2',
  title: 'Monitor M2',
  handle: 'monitor-m2',
  monitor_video_inputs: ['DisplayPort'],
};

const docks = [D1, D2, D3, D4];

console.log('=== RUNNING COMPATIBILITY MATRIX VERIFICATION ===\n');

let allPassed = true;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName} - ${details || ''}`);
    allPassed = false;
  }
}

// 1. Test P1: Confirms D1, D2, D3 compatible; excludes D4
const p1Compatible = docks.filter((d) => checkDockCompatibility(P1, d).compatible).map((d) => d.id);
assert(
  JSON.stringify(p1Compatible) === JSON.stringify(['D1', 'D2', 'D3']),
  'Test P1 Profile Compatibility',
  `Expected ['D1', 'D2', 'D3'], received: ${JSON.stringify(p1Compatible)}`
);

// 2. Test P2: Confirms D2, D3 compatible; excludes D1 (wattage failure) and D4
const p2Compatible = docks.filter((d) => checkDockCompatibility(P2, d).compatible).map((d) => d.id);
assert(
  JSON.stringify(p2Compatible) === JSON.stringify(['D2', 'D3']),
  'Test P2 Profile Compatibility (100W requirement)',
  `Expected ['D2', 'D3'], received: ${JSON.stringify(p2Compatible)}`
);
const d1ForP2 = checkDockCompatibility(P2, D1);
assert(
  !d1ForP2.compatible && Boolean(d1ForP2.reason?.includes('Insufficient power delivery')),
  'Test P2 Wattage Rejection Reason for D1',
  `Reason: ${d1ForP2.reason}`
);

// 3. Test P3: Confirms D1, D2 compatible; excludes D3 (OS failure) and D4
const p3Compatible = docks.filter((d) => checkDockCompatibility(P3, d).compatible).map((d) => d.id);
assert(
  JSON.stringify(p3Compatible) === JSON.stringify(['D1', 'D2']),
  'Test P3 Profile Compatibility (macOS requirement)',
  `Expected ['D1', 'D2'], received: ${JSON.stringify(p3Compatible)}`
);
const d3ForP3 = checkDockCompatibility(P3, D3);
assert(
  !d3ForP3.compatible && Boolean(d3ForP3.reason?.includes('OS mismatch')),
  'Test P3 OS Rejection Reason for D3',
  `Reason: ${d3ForP3.reason}`
);

// 4. Test P4: Renders explicit no-compatible-setup message (all docks excluded or video_support false)
const p4Checks = docks.map((d) => checkDockCompatibility(P4, d));
const p4AnyCompatible = p4Checks.some((res) => res.compatible);
assert(
  !p4AnyCompatible && p4Checks.every((res) => Boolean(res.reason?.includes('video output'))),
  'Test P4 Rejection for all docks due to lack of video Alt Mode',
  `All docks rejected correctly for P4`
);

// 5. Test Monitor M1 with D3: Excluded (DisplayPort-only dock cannot feed HDMI-only monitor)
const m1WithD3 = checkMonitorCompatibility(D3, M1);
assert(
  !m1WithD3.compatible && Boolean(m1WithD3.reason?.includes('Port mismatch')),
  'Test Monitor M1 with Dock D3 (DisplayPort only vs HDMI input)',
  `Reason: ${m1WithD3.reason}`
);

// 6. Test Monitor M1 with D1 / D2 (HDMI output matches HDMI input)
const m1WithD1 = checkMonitorCompatibility(D1, M1);
const m1WithD2 = checkMonitorCompatibility(D2, M1);
assert(
  m1WithD1.compatible && m1WithD2.compatible,
  'Test Monitor M1 with D1 & D2 (HDMI match)'
);

// 7. Test Monitor M2 with D2 & D3 (DisplayPort match)
const m2WithD3 = checkMonitorCompatibility(D3, M2);
assert(
  m2WithD3.compatible,
  'Test Monitor M2 with D3 (DisplayPort match)'
);

console.log('\n=================================================');
if (allPassed) {
  console.log('🎉 ALL COMPATIBILITY FIXTURE TESTS PASSED (100%)');
} else {
  console.error('⚠️ SOME TESTS FAILED');
  process.exit(1);
}
