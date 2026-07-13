// =============================================================================
// FLOWSTATE — AudioManager.cs
// Central audio management service.
// =============================================================================

using UnityEngine;
using Flowstate.Core.Architecture;

namespace Flowstate.Audio
{
    /// <summary>
    /// Central audio service managing music, SFX, and adaptive audio.
    /// Registered as a service through ServiceRegistry.
    /// </summary>
    public class AudioManager : MonoBehaviour, IService
    {
        [Header("Audio Sources")]
        [SerializeField] private AudioSource _musicSource;
        [SerializeField] private AudioSource _sfxSource;

        [Header("Settings")]
        [SerializeField] [Range(0f, 1f)] private float _masterVolume = 1f;
        [SerializeField] [Range(0f, 1f)] private float _musicVolume = 0.7f;
        [SerializeField] [Range(0f, 1f)] private float _sfxVolume = 1f;

        public void Initialize()
        {
            // TODO: Load audio settings from persistence
            // TODO: Subscribe to harmony/flow events for adaptive music
            Debug.Log("[AudioManager] Initialized.");
        }

        public void Shutdown()
        {
            // TODO: Save audio settings
        }

        /// <summary>
        /// Play a one-shot sound effect.
        /// </summary>
        public void PlaySFX(AudioClip clip, float volumeScale = 1f)
        {
            if (clip == null) return;
            _sfxSource?.PlayOneShot(clip, _sfxVolume * _masterVolume * volumeScale);
        }

        /// <summary>
        /// Transition to a new music track.
        /// </summary>
        public void SetMusic(AudioClip clip, float fadeDuration = 1f)
        {
            // TODO: Implement crossfade between tracks
            if (_musicSource != null && clip != null)
            {
                _musicSource.clip = clip;
                _musicSource.volume = _musicVolume * _masterVolume;
                _musicSource.Play();
            }
        }
    }
}
