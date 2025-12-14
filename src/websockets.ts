let countSocket: WebSocket;

export function subscribeToCount(
  processMessage: (event: MessageEvent<any>) => void
) {
  if (countSocket) return; // subscription already created
  countSocket = new WebSocket("/subscribe");
  countSocket.addEventListener("message", processMessage);
  countSocket.addEventListener("close", () => subscribeToCount(processMessage));
}
