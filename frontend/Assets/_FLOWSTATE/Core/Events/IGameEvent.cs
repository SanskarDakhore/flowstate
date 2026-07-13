// =============================================================================
// FLOWSTATE — IGameEvent.cs
// Marker interface for all game events.
// =============================================================================

namespace Flowstate.Core.Events
{
    /// <summary>
    /// Marker interface for all events dispatched through the GameEventBus.
    /// Implement this for each distinct event type.
    /// </summary>
    public interface IGameEvent { }
}
