// =============================================================================
// FLOWSTATE — IService.cs
// Base interface for all injectable services.
// =============================================================================

namespace Flowstate.Core.Architecture
{
    /// <summary>
    /// Base interface for all services managed by the ServiceRegistry.
    /// Services should be stateless or manage their own lifecycle.
    /// </summary>
    public interface IService
    {
        /// <summary>
        /// Called once during bootstrap to initialize the service.
        /// </summary>
        void Initialize();

        /// <summary>
        /// Called during shutdown to release resources.
        /// </summary>
        void Shutdown();
    }
}
