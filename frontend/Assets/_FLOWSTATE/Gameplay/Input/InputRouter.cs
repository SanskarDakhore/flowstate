// =============================================================================
// FLOWSTATE — InputRouter.cs
// Routes raw input to appropriate handlers based on gesture type.
// =============================================================================

using UnityEngine;

namespace Flowstate.Gameplay.Input
{
    /// <summary>
    /// Routes raw touch/mouse input to specialized handlers (tap, swipe, hold).
    /// Decouples input detection from gameplay response.
    /// </summary>
    public class InputRouter : MonoBehaviour
    {
        private TapInputHandler _tapHandler;
        private SwipeInputHandler _swipeHandler;
        private HoldInputHandler _holdHandler;

        private bool _inputEnabled = true;

        private void Awake()
        {
            _tapHandler = GetComponent<TapInputHandler>();
            _swipeHandler = GetComponent<SwipeInputHandler>();
            _holdHandler = GetComponent<HoldInputHandler>();
        }

        private void Update()
        {
            if (!_inputEnabled) return;

            // TODO: Detect input type and route to appropriate handler
            // Phase 1: Use Unity's Input system
            // Phase 2: Migrate to Input System package for better mobile support
        }

        /// <summary>
        /// Enable or disable input processing (e.g., during transitions).
        /// </summary>
        public void SetInputEnabled(bool enabled)
        {
            _inputEnabled = enabled;
        }
    }
}
