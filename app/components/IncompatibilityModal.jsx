import {useEffect} from 'react';
import {AlertTriangleIcon} from './SetupIcons';

/**
 * UI-BUILD-03: Rejection Reason Explainer Modal & Bottom Sheet
 * Visual feedback for excluded or incompatible items with animated shake effect,
 * plain-English diagnosis, and actionable recovery recommendations.
 */
export function IncompatibilityModal({item, onClose, onSwitchDevice, onSelectRecommended}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const {
    title = 'Selected Component',
    reasons = [],
    reason = 'This hardware configuration does not meet system requirements.',
    recommendedAction = 'Select a compatible 100W dock or change your laptop profile.',
    profileName = 'Your Laptop',
    itemType = 'dock',
  } = item;

  const displayReason = reasons.length > 0 ? reasons.join(' ') : reason;

  return (
    <div
      className="incompatibility-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="incompat-modal-title"
      onClick={onClose}
    >
      <div
        className="incompatibility-modal shake-trigger"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close incompatibility alert"
        >
          ✕
        </button>

        {/* Warning Icon Badge */}
        <div className="incompat-badge-header">
          <div className="error-icon-circle">
            <AlertTriangleIcon size={32} />
          </div>
          <span className="incompat-status-tag">Hardware Incompatibility</span>
        </div>

        {/* Modal Title */}
        <h3 id="incompat-modal-title" className="incompat-title">
          {title}
        </h3>

        {/* Rejection Explainer Box */}
        <div className="incompat-reason-callout">
          <p className="incompat-reason-text">
            <strong>Diagnosis:</strong> {displayReason}
          </p>
        </div>

        {/* Plain-English Technical Clarification */}
        <div className="incompat-plain-explanation">
          {displayReason.includes('charging output') || displayReason.includes('power') ? (
            <p>
              Your {profileName} demands high sustained charging power. Running a lower-wattage dock
              could cause battery drain while plugged in, system throttling, or port disconnects.
            </p>
          ) : displayReason.includes('USB-C video') || displayReason.includes('video') ? (
            <p>
              Your selected device profile does not support native video transmission through this connector.
              External monitors require a USB-C or Thunderbolt port with DisplayPort Alt Mode.
            </p>
          ) : displayReason.includes('OS') || displayReason.includes('incompatibility') ? (
            <p>
              This docking station relies on operating system display drivers that are incompatible with {profileName}.
            </p>
          ) : (
            <p>
              The display connectors on this screen cannot plug into the available ports on your selected dock without active signal conversion adapters.
            </p>
          )}
        </div>

        {/* Actionable Solution Recommendations */}
        <div className="incompat-recommendation-box">
          <div className="recom-title">
            <span className="recom-sparkle">💡</span> Recommended Solution:
          </div>
          <p className="recom-text">{recommendedAction}</p>
        </div>

        {/* Action Buttons */}
        <div className="incompat-actions">
          {onSelectRecommended && (
            <button
              type="button"
              className="btn-primary modal-action-btn"
              onClick={() => {
                onSelectRecommended();
                onClose();
              }}
            >
              Choose Recommended Option
            </button>
          )}

          {onSwitchDevice && (
            <button
              type="button"
              className="btn-secondary modal-action-btn"
              onClick={() => {
                onSwitchDevice();
                onClose();
              }}
            >
              Change Laptop Profile
            </button>
          )}

          <button
            type="button"
            className="btn-outline modal-action-btn"
            onClick={onClose}
          >
            Keep Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
