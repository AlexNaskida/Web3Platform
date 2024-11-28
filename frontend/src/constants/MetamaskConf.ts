// Revise this part
interface Ethereum {
  request: (args: { method: string; params?: string[] }) => Promise<string>;
  on(eventName: string, handler: (accounts: string[]) => void): void;
  removeListener: (
    eventName: string,
    handler: (...args: string[]) => void
  ) => void;
  isMetaMask: boolean;
}
// This part of the code extends the global Window interface in TypeScript to include the ethereum property. By doing so, it informs TypeScript that the window object may contain an ethereum property, which adheres to the Ethereum interface defined earlier.
declare global {
  interface Window {
    ethereum: Ethereum;
  }
}
