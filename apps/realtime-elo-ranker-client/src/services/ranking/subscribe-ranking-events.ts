const URL = "/api/ranking/events";

/**
 * Subscribe to ranking events
 * 
 * Sends a request to the server to subscribe to ranking events via SSE response
 * 
 * @description This function is used to subscribe to ranking events. It expects for output messages to be of type RankingEvent.
 * 
 * @returns {EventSource} The event source to listen to ranking events
 */
export default function subscribeRankingEvents(baseUrl: string): EventSource {
  // Subscribe to ranking events
  // ...
  return new EventSource(baseUrl + URL);
}