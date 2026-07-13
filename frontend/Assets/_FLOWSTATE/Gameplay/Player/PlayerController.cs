// =============================================================================
// FLOWSTATE — PlayerController.cs
// Central coordinator for the player entity.
// =============================================================================

using UnityEngine;

namespace Flowstate.Gameplay.Player
{
    /// <summary>
    /// Central controller for the player entity. Coordinates between
    /// input, movement, state, and interaction subsystems.
    /// Does not contain movement math or input parsing directly.
    /// </summary>
    public class PlayerController : MonoBehaviour
    {
        [SerializeField] private PlayerState _state;

        private PlayerMovement _movement;

        private void Awake()
        {
            _movement = GetComponent<PlayerMovement>();
            _state = new PlayerState();
        }

        private void Update()
        {
            // TODO: Coordinate between input results, movement, and state
        }

        /// <summary>
        /// Reset the player to its initial state for a new session.
        /// </summary>
        public void ResetForNewSession()
        {
            _state.Reset();
            // TODO: Reset position, visual state, etc.
        }
    }
}
