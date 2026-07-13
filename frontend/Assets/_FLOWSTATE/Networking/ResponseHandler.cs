// =============================================================================
// FLOWSTATE — ResponseHandler.cs
// Standardized API response handling and error mapping.
// =============================================================================

using UnityEngine;

namespace Flowstate.Networking
{
    /// <summary>
    /// Handles API response parsing, error mapping, and retry logic.
    /// </summary>
    public static class ResponseHandler
    {
        /// <summary>
        /// Deserialize a successful response body.
        /// </summary>
        public static T Deserialize<T>(ApiResponse response)
        {
            if (!response.IsSuccess)
            {
                Debug.LogError($"[ResponseHandler] Cannot deserialize error response: {response.StatusCode}");
                return default;
            }

            try
            {
                return JsonUtility.FromJson<T>(response.Body);
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"[ResponseHandler] Deserialization failed: {ex.Message}");
                return default;
            }
        }

        /// <summary>
        /// Check if the response indicates the client should retry.
        /// </summary>
        public static bool ShouldRetry(ApiResponse response)
        {
            return response.StatusCode >= 500 || response.StatusCode == 429;
        }

        /// <summary>
        /// Check if the response indicates an authentication error.
        /// </summary>
        public static bool IsAuthError(ApiResponse response)
        {
            return response.StatusCode == 401;
        }
    }
}
