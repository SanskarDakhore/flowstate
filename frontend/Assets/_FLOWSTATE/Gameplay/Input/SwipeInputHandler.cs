// =============================================================================
// FLOWSTATE — SwipeInputHandler.cs
// Handles swipe gesture detection for directional control.
// =============================================================================

using UnityEngine;

namespace Flowstate.Gameplay.Input
{
    /// <summary>
    /// Detects and responds to swipe gestures.
    /// Swipes are used for: changing direction, path selection, dodging.
    /// </summary>
    public class SwipeInputHandler : MonoBehaviour
    {
        [Header("Swipe Settings")]
        [SerializeField] private float _minSwipeDistance = 50f; // pixels
        [SerializeField] private float _maxSwipeTime = 0.5f;

        // TODO: Implement swipe detection
        // - Track touch start position and time
        // - On release, calculate distance and direction
        // - If thresholds met, determine swipe direction (up/down/left/right)
        // - Publish SwipeEvent through GameEventBus

        /// <summary>
        /// Process a completed swipe gesture.
        /// </summary>
        public void ProcessSwipe(Vector2 startPosition, Vector2 endPosition, float duration)
        {
            // TODO: Calculate direction, publish event
        }
    }
}
