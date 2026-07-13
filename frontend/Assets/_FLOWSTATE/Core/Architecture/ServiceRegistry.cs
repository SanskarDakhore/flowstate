// =============================================================================
// FLOWSTATE — ServiceRegistry.cs
// Central service locator with explicit registration. Avoids singleton sprawl.
// =============================================================================

using System;
using System.Collections.Generic;
using UnityEngine;

namespace Flowstate.Core.Architecture
{
    /// <summary>
    /// Central registry for all game services. Provides controlled access
    /// to services without relying on global singletons.
    ///
    /// Usage:
    ///   ServiceRegistry.Register&lt;IAudioService&gt;(audioService);
    ///   var audio = ServiceRegistry.Get&lt;IAudioService&gt;();
    /// </summary>
    public static class ServiceRegistry
    {
        private static readonly Dictionary<Type, IService> _services = new();
        private static bool _isInitialized;

        /// <summary>
        /// Register a service by its interface type.
        /// </summary>
        public static void Register<T>(T service) where T : class, IService
        {
            var type = typeof(T);
            if (_services.ContainsKey(type))
            {
                Debug.LogWarning($"[ServiceRegistry] Overwriting existing service: {type.Name}");
            }
            _services[type] = service;
        }

        /// <summary>
        /// Retrieve a registered service by its interface type.
        /// </summary>
        public static T Get<T>() where T : class, IService
        {
            var type = typeof(T);
            if (_services.TryGetValue(type, out var service))
            {
                return service as T;
            }

            Debug.LogError($"[ServiceRegistry] Service not found: {type.Name}");
            return null;
        }

        /// <summary>
        /// Check if a service is registered.
        /// </summary>
        public static bool Has<T>() where T : class, IService
        {
            return _services.ContainsKey(typeof(T));
        }

        /// <summary>
        /// Initialize all registered services in registration order.
        /// </summary>
        public static void InitializeAll()
        {
            foreach (var service in _services.Values)
            {
                service.Initialize();
            }
            _isInitialized = true;
        }

        /// <summary>
        /// Shutdown all services and clear the registry.
        /// </summary>
        public static void ShutdownAll()
        {
            foreach (var service in _services.Values)
            {
                service.Shutdown();
            }
            _services.Clear();
            _isInitialized = false;
        }
    }
}
