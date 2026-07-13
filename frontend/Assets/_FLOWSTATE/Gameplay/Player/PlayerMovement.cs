// =============================================================================
// FLOWSTATE — PlayerMovement.cs
// Handles continuous player movement along paths.
// =============================================================================

using UnityEngine;

namespace Flowstate.Gameplay.Player
{
    /// <summary>
    /// Handles the player entity's continuous movement through the world.
    /// The player moves automatically; input affects direction and interactions,
    /// not whether the player moves.
    /// </summary>
    public class PlayerMovement : MonoBehaviour
    {
        [Header("Movement Settings")]
        [SerializeField] private float _baseSpeed = 5f;
        [SerializeField] private float _currentSpeed;

        private Vector3 _moveDirection = Vector3.forward;

        private void Awake()
        {
            _currentSpeed = _baseSpeed;
        }

        private void Update()
        {
            // TODO: Move along current path/direction
            // transform.position += _moveDirection * _currentSpeed * Time.deltaTime;
        }

        /// <summary>
        /// Adjust movement direction based on input.
        /// </summary>
        public void SetDirection(Vector3 direction)
        {
            _moveDirection = direction.normalized;
        }

        /// <summary>
        /// Modify speed (e.g., for flow state bonuses or obstacles).
        /// </summary>
        public void SetSpeedMultiplier(float multiplier)
        {
            _currentSpeed = _baseSpeed * Mathf.Max(0f, multiplier);
        }
    }
}
