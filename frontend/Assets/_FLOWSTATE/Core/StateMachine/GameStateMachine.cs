// =============================================================================
// FLOWSTATE — GameStateMachine.cs
// Simple state machine for managing high-level game states.
// =============================================================================

using UnityEngine;

namespace Flowstate.Core.StateMachine
{
    /// <summary>
    /// Manages transitions between high-level game states.
    /// Not intended for complex AI or animation states — use
    /// dedicated state machines for those.
    /// </summary>
    public class GameStateMachine
    {
        public IGameState CurrentState { get; private set; }

        /// <summary>
        /// Transition to a new state. Calls Exit on current, Enter on next.
        /// </summary>
        public void TransitionTo(IGameState nextState)
        {
            if (nextState == null)
            {
                Debug.LogError("[StateMachine] Cannot transition to null state.");
                return;
            }

            if (CurrentState == nextState)
            {
                Debug.LogWarning("[StateMachine] Already in the requested state.");
                return;
            }

            CurrentState?.Exit();
            CurrentState = nextState;
            CurrentState.Enter();

            Debug.Log($"[StateMachine] Transitioned to {nextState.GetType().Name}");
        }

        /// <summary>
        /// Update the current state. Call from a MonoBehaviour's Update.
        /// </summary>
        public void Update()
        {
            CurrentState?.Update();
        }
    }
}
