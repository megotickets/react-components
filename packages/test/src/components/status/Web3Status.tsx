import { useAccount, useWeb3Context } from "@megotickets/wallet";

export function Web3Status() {
  const { loggedAs } = useWeb3Context();
  const { isConnected } = useAccount();
  return <div className="flex flex-col gap-2">
    <p>{loggedAs ? "Connected" : "Disconnected"}</p>
    <p>{isConnected ? "Connected with traditional provider" : "Disconnected from traditional provider"}</p>
  </div>
}
