// =============================================================================
// FLOWSTATE — GameEventBus.cs
// Lightweight typed event bus for decoupled communication.
// =============================================================================

using System;
using System.Collections.Generic;
using UnityEngine;

namespace Flowstate.Core.Events
{
    /// <summary>
    /// Typed publish/subscribe event bus for decoupled system communication.
    /// Avoids tight coupling between gameplay, presentation, audio, and UI.
    ///
    /// Usage:
    ///   GameEventBus.Subscribe&lt;ScoreChangedEvent&gt;(OnScoreChanged);
    ///   GameEventBus.Publish(new ScoreChangedEvent { NewScore = 100 });
    /// </summary>
    public static class GameEventBus
    {
        private static readonly Dictionary<Type, List<Delegate>> _subscribers = new();

        /// <summary>
        /// Subscribe to an event type.
        /// </summary>
        public static void Subscribe<T>(Action<T> handler) where T : IGameEvent
        {
            var type = typeof(T);
            if (!_subscribers.ContainsKey(type))
            {
                _subscribers[type] = new List<Delegate>();
            }
            _subscribers[type].Add(handler);
        }

        /// <summary>
        /// Unsubscribe from an event type.
        /// </summary>
        public static void Unsubscribe<T>(Action<T> handler) where T : IGameEvent
        {
            var type = typeof(T);
            if (_subscribers.ContainsKey(type))
            {
                _subscribers[type].Remove(handler);
            }
        }

        /// <summary>
        /// Publish an event to all subscribers.
        /// </summary>
        public static void Publish<T>(T gameEvent) where T : IGameEvent
        {
            var type = typeof(T);
            if (!_subscribers.ContainsKey(type)) return;

            foreach (var handler in _subscribers[type].ToArray())
            {
                try
                {
                    ((Action<T>)handler)?.Invoke(gameEvent);
                }
                catch (Exception ex)
                {
                    Debug.LogError($"[EventBus] Error handling {type.Name}: {ex.Message}");
                }
            }
        }

        /// <summary>
        /// Remove all subscribers. Called during shutdown.
        /// </summary>
        public static void Clear()
        {
            _subscribers.Clear();
        }
    }
}
