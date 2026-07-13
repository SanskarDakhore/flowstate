// =============================================================================
// FLOWSTATE — ApiRoutes.cs
// Centralized API endpoint definitions matching backend routing.
// =============================================================================

namespace Flowstate.Networking
{
    /// <summary>
    /// Centralized definition of all API endpoints.
    /// Must stay in sync with backend route definitions.
    /// </summary>
    public static class ApiRoutes
    {
        private const string V1 = "/api/v1";

        // Health
        public static string Health => $"{V1}/health";

        // Authentication
        public static string AuthGuest => $"{V1}/auth/guest";
        public static string AuthRefresh => $"{V1}/auth/refresh";

        // Player
        public static string PlayerMe => $"{V1}/player/me";

        // Progression
        public static string Progression => $"{V1}/progression";

        // Inventory
        public static string Inventory => $"{V1}/inventory";

        // Cosmetics
        public static string Cosmetics => $"{V1}/cosmetics";

        // Sessions
        public static string SessionStart => $"{V1}/sessions/start";
        public static string SessionComplete(string sessionId) => $"{V1}/sessions/{sessionId}/complete";

        // Game Results
        public static string GameResults => $"{V1}/game-results";

        // Leaderboards
        public static string Leaderboard(string boardId) => $"{V1}/leaderboards/{boardId}";
        public static string LeaderboardMe(string boardId) => $"{V1}/leaderboards/{boardId}/me";

        // Remote Config
        public static string Config => $"{V1}/config";
    }
}
