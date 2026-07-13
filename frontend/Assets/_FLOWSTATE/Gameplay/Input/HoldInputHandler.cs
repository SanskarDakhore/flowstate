// =============================================================================
// FLOWSTATE — HoldInputHandler.cs
// Handles hold/press-and-hold gesture detection.
// =============================================================================

using UnityEngine;

namespace Flowstate.Gameplay.Input
{
    /// <summary>
    /// Detects and responds to hold (press-and-hold) gestures.
    /// Holds are used for: sustained interactions, charging abilities,
    /// activating sustained environmental effects.
    /// </summary>
    public class HoldInputHandler : MonoBehaviour
    {
        [Header("Hold Settings")]
        [SerializeField] private float _holdThreshold = 0.4f; // seconds before hold activates

        private bool _isHolding;
        private float _holdStartTime;

        // TODO: Implement hold detection
        // - Track touch down time
        // - After threshold, enter hold state
        // - Publish HoldStartEvent / HoldEndEvent through GameEventBus
        // - Provide hold duration to consumers

        /// <summary>
        /// Current hold duration if actively holding, otherwise 0.
        /// </summary>
        public float CurrentHoldDuration =>
            _isHolding ? Time.time - _holdStartTime : 0f;
    }
}
