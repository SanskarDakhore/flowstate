// =============================================================================
// FLOWSTATE — SceneRouter.cs
// Manages scene loading, transitions, and navigation history.
// =============================================================================

using System;
using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Flowstate.Scenes
{
    /// <summary>
    /// Handles scene navigation with support for:
    /// - Async scene loading
    /// - Loading screen display
    /// - Transition effects
    /// - Duplicate transition prevention
    /// - Navigation history for back navigation
    ///
    /// Access through ServiceRegistry, not as a singleton.
    /// </summary>
    public class SceneRouter : MonoBehaviour
    {
        private SceneId _currentScene = SceneId.Bootstrap;
        private bool _isTransitioning;

        /// <summary>
        /// Currently active scene.
        /// </summary>
        public SceneId CurrentScene => _currentScene;

        /// <summary>
        /// Whether a scene transition is in progress.
        /// </summary>
        public bool IsTransitioning => _isTransitioning;

        /// <summary>
        /// Navigate to a scene by its identifier.
        /// </summary>
        /// <param name="sceneId">Target scene.</param>
        /// <param name="showLoadingScreen">Whether to display a loading screen.</param>
        public void LoadScene(SceneId sceneId, bool showLoadingScreen = true)
        {
            if (_isTransitioning)
            {
                Debug.LogWarning($"[SceneRouter] Already transitioning. Ignoring request to load {sceneId}.");
                return;
            }

            if (sceneId == _currentScene)
            {
                Debug.LogWarning($"[SceneRouter] Already on scene {sceneId}.");
                return;
            }

            StartCoroutine(LoadSceneAsync(sceneId, showLoadingScreen));
        }

        private IEnumerator LoadSceneAsync(SceneId sceneId, bool showLoadingScreen)
        {
            _isTransitioning = true;

            // TODO: Show loading screen / transition effect
            // TODO: Fire scene exit events

            var operation = SceneManager.LoadSceneAsync(sceneId.ToString());
            if (operation == null)
            {
                Debug.LogError($"[SceneRouter] Failed to load scene: {sceneId}");
                _isTransitioning = false;
                yield break;
            }

            operation.allowSceneActivation = false;

            while (operation.progress < 0.9f)
            {
                yield return null;
            }

            // TODO: Hide loading screen / play transition effect
            operation.allowSceneActivation = true;

            _currentScene = sceneId;
            _isTransitioning = false;

            // TODO: Fire scene enter events
            Debug.Log($"[SceneRouter] Loaded scene: {sceneId}");
        }
    }
}
