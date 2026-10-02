/**
 * Simple Device Compatibility Widget
 * Visual icons showing "Works with your devices" - no technical checking
 */
export function SimpleCompatibilityWidget({product}) {
  const parseList = (raw) => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [raw];
    } catch {
      return String(raw).split(',').map((s) => s.trim());
    }
  };

  const supportedOS = parseList(product?.supportedOS?.value || '');
  const isDock = product?.title?.toLowerCase().includes('dock');

  // Default devices with real brand SVG icons
  const devices = [
    {
      name: 'Mac',
      supported: true,
      icon: (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.3-3.16-2.54-.87-1.36-1.41-3.74-1.41-6.24 0-3.67 2.4-5.64 4.76-5.64 1.25 0 2.18.94 3.28.94 1.04 0 1.84-.92 3.34-.92 2.32 0 4.01 1.52 4.56 3.75.1.23.09.56-.07.91-.87 1.92-2.78 2.96-5.3 2.96-.67 0-1.29-.1-1.9-.25.38-1.186.692-2.39.825-3.61.077-.61.065-1.21-.02-1.8-.1-.68-.23-1.35-.38-2.01-.034-.17-.1-.33-.19-.47"/>
        </svg>
      )
    },
    {
      name: 'Windows PC',
      supported: true,
      icon: (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5v14c0 .5.5 1 1 1h16c.5 0 1-.5 1-1V5c0-.5-.5-1-1-1H4c-.5 0-1 .5-1 1zm2 1h6v5H5V6zm8 0h6v5h-6V6zm-8 7h6v5H5v-5zm8 0h6v5h-6v-5z"/>
        </svg>
      )
    },
    {
      name: 'iPad Pro',
      supported: true,
      icon: (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 18c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      )
    },
    {
      name: 'Android & Others',
      supported: true,
      icon: (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.6 11.48h.01c.49 0 .99-.05 1.48-.1-.01.21-.02.43-.02.66 0 3.9-3.01 7.21-6.6 7.48h-.29C7.29 19.1 4 15.8 4 11.9c0-.23 0-.45.02-.67.49.05.99.1 1.48.1h.01c1.9 0 3.75-.5 5.35-1.39.39.56.91 1.05 1.52 1.38.56.33 1.19.52 1.86.52.96 0 1.85-.33 2.56-.91.69-.58 1.15-1.41 1.31-2.37z"/>
          <ellipse cx="8.5" cy="8.5" rx="1.5" ry="1.5"/>
          <ellipse cx="15.5" cy="8.5" rx="1.5" ry="1.5"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="compatibility-section">
      <div className="device-compatibility">
        <h3 className="compatibility-title">Works With Your Devices</h3>
        <div className="device-list">
          {devices.map((device, idx) => (
            <div key={idx} className="device-item">
              <div className="device-logo-svg">{device.icon}</div>
              <div className="device-name">{device.name}</div>
              {device.supported && <div className="check-mark">✓</div>}
            </div>
          ))}
        </div>
        <p className="compatibility-note">
          If your device has a USB-C port, it works with this. That includes most modern laptops, tablets, and phones.
        </p>
      </div>
    </section>
  );
}
