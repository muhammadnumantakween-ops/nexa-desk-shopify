import {useLoaderData} from 'react-router';
import {MockShopNotice} from '~/components/MockShopNotice';
import {HeroAssembly} from '~/components/HeroAssembly';
import {DeviceSelectorBanner} from '~/components/DeviceSelectorBanner';
import {PowerFlowVisualizer} from '~/components/PowerFlowVisualizer';
import {BentoGridCollections} from '~/components/BentoGridCollections';
import {CustomerSetupShowcase} from '~/components/CustomerSetupShowcase';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'NexaDesk UK | Precision Docks, Workstations & Compatibility'},
    {
      name: 'description',
      content:
        'Certified UK workstation accessories, docking stations, and ergonomic desk peripherals engineered for remote professionals, creators, and modern teams.',
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  return {};
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      {data.isShopLinked ? null : <MockShopNotice />}

      {/* UI-HOME-01: Kinetic 3D Desk Setup Assembly Hero */}
      <HeroAssembly />

      {/* UI-HOME-02: Interactive Device Selector Banner */}
      <DeviceSelectorBanner />

      {/* UI-HOME-03: Interactive Port & Power Flow Visualizer */}
      <PowerFlowVisualizer />

      {/* UI-HOME-04: Parallax Hover Bento Grid Collections */}
      <BentoGridCollections />

      {/* UI-HOME-05: UK Remote Worker Setup Showcase Carousel */}
      <CustomerSetupShowcase />
    </div>
  );
}

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
