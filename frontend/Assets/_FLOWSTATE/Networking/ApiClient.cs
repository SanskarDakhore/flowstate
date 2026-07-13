// =============================================================================
// FLOWSTATE — ApiClient.cs
// HTTP client for communicating with the FLOWSTATE backend API.
// =============================================================================

using System;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;

namespace Flowstate.Networking
{
    /// <summary>
    /// HTTP client for backend API communication.
    /// Handles request building, authentication headers, and response parsing.
    /// Does not contain business logic — delegates to service layer.
    /// </summary>
    public class ApiClient
    {
        private string _baseUrl;
        private string _authToken;

        public ApiClient(string baseUrl)
        {
            _baseUrl = baseUrl.TrimEnd('/');
        }

        /// <summary>
        /// Set the authentication token for subsequent requests.
        /// </summary>
        public void SetAuthToken(string token)
        {
            _authToken = token;
        }

        /// <summary>
        /// Send a GET request.
        /// </summary>
        public async Task<ApiResponse> Get(string endpoint)
        {
            var url = $"{_baseUrl}{endpoint}";
            using var request = UnityWebRequest.Get(url);
            AttachHeaders(request);

            var operation = request.SendWebRequest();
            while (!operation.isDone) await Task.Yield();

            return ParseResponse(request);
        }

        /// <summary>
        /// Send a POST request with JSON body.
        /// </summary>
        public async Task<ApiResponse> Post(string endpoint, string jsonBody = null)
        {
            var url = $"{_baseUrl}{endpoint}";
            using var request = new UnityWebRequest(url, "POST");

            if (!string.IsNullOrEmpty(jsonBody))
            {
                var bodyBytes = System.Text.Encoding.UTF8.GetBytes(jsonBody);
                request.uploadHandler = new UploadHandlerRaw(bodyBytes);
                request.SetRequestHeader("Content-Type", "application/json");
            }

            request.downloadHandler = new DownloadHandlerBuffer();
            AttachHeaders(request);

            var operation = request.SendWebRequest();
            while (!operation.isDone) await Task.Yield();

            return ParseResponse(request);
        }

        /// <summary>
        /// Send a PATCH request with JSON body.
        /// </summary>
        public async Task<ApiResponse> Patch(string endpoint, string jsonBody)
        {
            var url = $"{_baseUrl}{endpoint}";
            using var request = new UnityWebRequest(url, "PATCH");

            var bodyBytes = System.Text.Encoding.UTF8.GetBytes(jsonBody);
            request.uploadHandler = new UploadHandlerRaw(bodyBytes);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            AttachHeaders(request);

            var operation = request.SendWebRequest();
            while (!operation.isDone) await Task.Yield();

            return ParseResponse(request);
        }

        private void AttachHeaders(UnityWebRequest request)
        {
            request.SetRequestHeader("Accept", "application/json");

            if (!string.IsNullOrEmpty(_authToken))
            {
                request.SetRequestHeader("Authorization", $"Bearer {_authToken}");
            }
        }

        private ApiResponse ParseResponse(UnityWebRequest request)
        {
            return new ApiResponse
            {
                StatusCode = (int)request.responseCode,
                Body = request.downloadHandler?.text,
                IsSuccess = request.result == UnityWebRequest.Result.Success,
                Error = request.error
            };
        }
    }

    /// <summary>
    /// Standardized API response wrapper.
    /// </summary>
    public class ApiResponse
    {
        public int StatusCode { get; set; }
        public string Body { get; set; }
        public bool IsSuccess { get; set; }
        public string Error { get; set; }
    }
}
