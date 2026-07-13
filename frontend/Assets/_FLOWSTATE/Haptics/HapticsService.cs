// =============================================================================
// FLOWSTATE — HapticsService.cs
// Platform-abstracted haptic feedback service.
// =============================================================================

using UnityEngine;
using Flowstate.Core.Architecture;

namespace Flowstate.Haptics
{
    /// <summary>
    /// Provides haptic feedback for gameplay interactions.
    /// Abstracts platform-specific haptic APIs (iOS Taptic, Android vibration).
    /// </summary>
    public class HapticsService : IService
    {
        private bool _hapticsEnabled = true;

        public void Initialize()
        {
            // TODO: Check platform haptic support
            Debug.Log("[HapticsService] Initialized.");
        }

        public void Shutdown() { }

        /// <summary>
        /// Light haptic tap (energy collection, UI tap).
        /// </summary>
        public void LightTap()
        {
            if (!_hapticsEnabled) return;
            // TODO: Platform-specific light haptic
        }

        /// <summary>
        /// Medium haptic impact (combo milestone, interaction).
        /// </summary>
        public void MediumImpact()
        {
            if (!_hapticsEnabled) return;
            // TODO: Platform-specific medium haptic
        }

        /// <summary>
        /// Heavy haptic impact (flow state activation, major event).
        /// </summary>
        public void HeavyImpact()
        {
            if (!_hapticsEnabled) return;
            // TODO: Platform-specific heavy haptic
        }

        public void SetEnabled(bool enabled) => _hapticsEnabled = enabled;
    }
}
