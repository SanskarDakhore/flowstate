// =============================================================================
// FLOWSTATE — RequestBuilder.cs
// Fluent request builder for API calls.
// =============================================================================

using System.Collections.Generic;
using UnityEngine;

namespace Flowstate.Networking
{
    /// <summary>
    /// Fluent builder for constructing API requests with headers,
    /// query parameters, and JSON bodies.
    /// </summary>
    public class RequestBuilder
    {
        private string _endpoint;
        private readonly Dictionary<string, string> _queryParams = new();
        private string _jsonBody;

        public RequestBuilder(string endpoint)
        {
            _endpoint = endpoint;
        }

        /// <summary>
        /// Add a query parameter.
        /// </summary>
        public RequestBuilder WithQuery(string key, string value)
        {
            _queryParams[key] = value;
            return this;
        }

        /// <summary>
        /// Set the JSON request body.
        /// </summary>
        public RequestBuilder WithBody(object body)
        {
            _jsonBody = JsonUtility.ToJson(body);
            return this;
        }

        /// <summary>
        /// Build the final endpoint URL with query parameters.
        /// </summary>
        public string BuildUrl()
        {
            if (_queryParams.Count == 0) return _endpoint;

            var queryString = new List<string>();
            foreach (var param in _queryParams)
            {
                queryString.Add($"{UnityEngine.Networking.UnityWebRequest.EscapeURL(param.Key)}={UnityEngine.Networking.UnityWebRequest.EscapeURL(param.Value)}");
            }

            return $"{_endpoint}?{string.Join("&", queryString)}";
        }

        /// <summary>
        /// Get the JSON body string.
        /// </summary>
        public string GetBody() => _jsonBody;
    }
}
