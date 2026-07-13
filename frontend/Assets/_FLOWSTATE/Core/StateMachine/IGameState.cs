// =============================================================================
// FLOWSTATE — IGameState.cs
// Interface for game states used by the GameStateMachine.
// =============================================================================

namespace Flowstate.Core.StateMachine
{
    /// <summary>
    /// Represents a discrete game state (e.g., MainMenu, Playing, Paused).
    /// Implemented by each concrete state.
    /// </summary>
    public interface IGameState
    {
        /// <summary>Called when entering this state.</summary>
        void Enter();

        /// <summary>Called every frame while this state is active.</summary>
        void Update();

        /// <summary>Called when exiting this state.</summary>
        void Exit();
    }
}
