// =============================================================================
// FLOWSTATE — TapInputHandler.cs
// Handles tap gesture detection and response.
// =============================================================================

using UnityEngine;

namespace Flowstate.Gameplay.Input
{
    /// <summary>
    /// Detects and responds to tap gestures.
    /// Taps are used for: collecting energy, activating objects,
    /// triggering interactions.
    /// </summary>
    public class TapInputHandler : MonoBehaviour
    {
        [Header("Tap Settings")]
        [SerializeField] private float _maxTapDuration = 0.3f;
        [SerializeField] private float _maxTapMovement = 10f; // pixels

        // TODO: Implement tap detection logic
        // - Track touch start time and position
        // - If released within duration and movement thresholds, fire tap event
        // - Publish TapEvent through GameEventBus

        /// <summary>
        /// Process a potential tap at the given screen position.
        /// </summary>
        public void ProcessTap(Vector2 screenPosition)
        {
            // TODO: Raycast to determine what was tapped
            // TODO: Publish appropriate gameplay event
        }
    }
}
