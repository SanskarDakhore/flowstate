// =============================================================================
// FLOWSTATE — UIRouter.cs
// Manages UI screen navigation, modals, and overlays.
// =============================================================================

using System.Collections.Generic;
using UnityEngine;

namespace Flowstate.UI.Navigation
{
    /// <summary>
    /// Manages UI navigation independently of scene loading.
    /// Supports full-screen navigation, modals, overlays, and HUD.
    ///
    /// UI routing is separate from scene routing:
    /// - SceneRouter handles Unity scene loading
    /// - UIRouter handles UI layer management within a scene
    /// </summary>
    public class UIRouter : MonoBehaviour
    {
        private readonly Stack<RouteId> _navigationStack = new();
        private RouteId _currentScreen = RouteId.SplashScreen;
        private RouteId? _currentModal;
        private readonly List<RouteId> _activeOverlays = new();

        /// <summary>
        /// Navigate to a full-screen UI route.
        /// </summary>
        public void NavigateTo(RouteId routeId)
        {
            if (routeId == _currentScreen)
            {
                Debug.LogWarning($"[UIRouter] Already on screen {routeId}.");
                return;
            }

            _navigationStack.Push(_currentScreen);

            // TODO: Hide current screen, show target screen
            // TODO: Play transition animation
            _currentScreen = routeId;
            Debug.Log($"[UIRouter] Navigated to {routeId}");
        }

        /// <summary>
        /// Go back to the previous screen.
        /// </summary>
        public bool GoBack()
        {
            if (_currentModal.HasValue)
            {
                DismissModal();
                return true;
            }

            if (_navigationStack.Count == 0)
            {
                Debug.LogWarning("[UIRouter] Navigation stack is empty.");
                return false;
            }

            var previousScreen = _navigationStack.Pop();
            _currentScreen = previousScreen;
            // TODO: Show previous screen with back transition
            Debug.Log($"[UIRouter] Navigated back to {previousScreen}");
            return true;
        }

        /// <summary>
        /// Show a modal on top of the current screen.
        /// </summary>
        public void ShowModal(RouteId modalId)
        {
            if (_currentModal.HasValue)
            {
                Debug.LogWarning("[UIRouter] A modal is already active. Dismiss it first.");
                return;
            }

            _currentModal = modalId;
            // TODO: Show modal with dimming background
            Debug.Log($"[UIRouter] Showing modal {modalId}");
        }

        /// <summary>
        /// Dismiss the current modal.
        /// </summary>
        public void DismissModal()
        {
            if (!_currentModal.HasValue) return;

            var dismissed = _currentModal.Value;
            _currentModal = null;
            // TODO: Hide modal, remove dimming
            Debug.Log($"[UIRouter] Dismissed modal {dismissed}");
        }

        /// <summary>
        /// Show an overlay (can have multiple active).
        /// </summary>
        public void ShowOverlay(RouteId overlayId)
        {
            if (_activeOverlays.Contains(overlayId)) return;

            _activeOverlays.Add(overlayId);
            // TODO: Show overlay
            Debug.Log($"[UIRouter] Showing overlay {overlayId}");
        }

        /// <summary>
        /// Hide an overlay.
        /// </summary>
        public void HideOverlay(RouteId overlayId)
        {
            _activeOverlays.Remove(overlayId);
            // TODO: Hide overlay
            Debug.Log($"[UIRouter] Hiding overlay {overlayId}");
        }
    }
}
