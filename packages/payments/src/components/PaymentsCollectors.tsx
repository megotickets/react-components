import { useBuyTicketContext } from "../context/BuyTicketContext";
import ArbitrumIcon from "./icons/cryptos/ArbitrumIcon";
import UsdcIcon from "./icons/cryptos/UsdcIcon";
import PolygonIcon from "./icons/cryptos/PolygonIcon";
import StripeIcon from "./icons/cryptos/StripeIcon";
import EtheriumIcon from "./icons/cryptos/EtheriumIcon";
import OptimismIcon from "./icons/cryptos/OptimismIcon";
import { useEffect, useState } from "react";

export const PaymentsCollectors = () => {
    const { eventDetails, processor, setProcessor } = useBuyTicketContext();
    const [selectedProcessor, setSelectedProcessor] = useState<string>('stripe');

    if (!eventDetails || eventDetails?.event?.collectors?.length === 0 || !eventDetails?.event?.collectors) {
        return;
    }

    if (eventDetails?.event?.price === 0) {
        return;
    }

    useEffect(() => {
        setProcessor(selectedProcessor);
    }, []);

    useEffect(() => {
        setSelectedProcessor(processor || 'stripe');
    }, [processor]);

    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "2rem", overflowX: "auto", width: "100%" }}>
            {
                Object.entries(eventDetails?.event?.collectors || {}).sort(([keyA], [keyB]) => keyA === "stripe" ? -1 : keyB === "stripe" ? 1 : 0).map(([key, value]) => {
                    return (
                        <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                            <div 
                                onClick={() => {
                                    console.log("Settato il processor a: ", key)
                                    setProcessor(key)
                                }} 
                                style={{ 
                                    display: "flex", 
                                    flexDirection: "row", 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    gap: "1rem", 
                                    cursor: "pointer",
                                    border: selectedProcessor === key ? "2px solid #007bff" : "none",
                                    borderRadius: "8px",
                                    padding: "8px"
                                }}
                            >
                                {key === "stripe" &&
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                                        <StripeIcon width={40} height={40} />
                                        <p>Card</p>
                                    </div>}
                                {key === "ethereum" && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                                    <EtheriumIcon width={40} height={40} />
                                    <p>Ethereum</p>
                                </div>}
                                {key === "arbitrum" && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                                    <ArbitrumIcon width={40} height={40} />
                                    <p>Arbitrum</p>
                                </div>}
                                {key === "polygon" && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                                    <PolygonIcon width={40} height={40} />
                                    <p>Polygon</p>
                                </div>}
                                {key.includes("erc20:ethereum") && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                                    <UsdcIcon width={40} height={40} />
                                    <p>USDC</p>
                                </div>}
                                {key.includes("erc20:polygon") && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                                    <UsdcIcon width={40} height={40} />
                                    <p>USDC</p>
                                </div>}
                                {key === "optimism" && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                                    <OptimismIcon width={40} height={40} />
                                    <p>Optimism</p>
                                </div>}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}