import { useBuyTicketContext } from "../context/BuyTicketContext";
import ArbitrumIcon from "./icons/cryptos/ArbitrumIcon";
import UsdcIcon from "./icons/cryptos/UsdcIcon";
import PolygonIcon from "./icons/cryptos/PolygonIcon";
import StripeIcon from "./icons/cryptos/StripeIcon";
import EtheriumIcon from "./icons/cryptos/EtheriumIcon";
import OptimismIcon from "./icons/cryptos/OptimismIcon";
import { useEffect, useState } from "react";
import USDTIcon from "./icons/USDTIcon";
import DaiIcons from "./icons/cryptos/DaiIcons";

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
        <div style={{ 
            display: "flex", 
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "flex-start", 
            flexWrap: "wrap",
            gap: "1rem",
            width: "100%" 
        }}>
            {
                Object.entries(eventDetails?.event?.collectors || {}).sort(([keyA], [keyB]) => keyA === "stripe" ? -1 : keyB === "stripe" ? 1 : 0).map(([key, value]) => {
                    return (
                        <div key={key} style={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            alignItems: "center", 
                            justifyContent: "center",
                            margin: "0.5rem",
                        }}>
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
                                {key.includes("erc20:ethereum") && (
                                    <div style={{ 
                                        display: "flex", 
                                        flexDirection: "column", 
                                        alignItems: "center", 
                                        justifyContent: "center", 
                                        gap: "1rem",
                                        position: "relative"
                                    }}>
                                        {/* Ethereum icon in alto a destra */}
                                        <div style={{ 
                                            position: "absolute", 
                                            top: "-5px", 
                                            right: "-5px",
                                            backgroundColor: "#fff",
                                            borderRadius: "50%",
                                            padding: "2px",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                        }}>
                                            <EtheriumIcon width={15} height={15} />
                                        </div>
                                        
                                        {/* USDC su Ethereum */}
                                        {key.includes("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") && (
                                            <>
                                                <UsdcIcon width={40} height={40} />
                                                <p>USDC</p>
                                            </>
                                        )}
                                        
                                        {/* DAI su Ethereum */}
                                        {key.includes("0x6b175474e89094c44da98b954eedeac495271d0f") && (
                                            <>
                                                <DaiIcons width={40} height={40} />
                                                <p>DAI</p>
                                            </>
                                        )}
                                        
                                        {/* USDT su Ethereum */}
                                        {key.includes("0xdac17f958d2ee523a2206206994597c13d831ec7") && (
                                            <>
                                                <USDTIcon width={40} height={40} />
                                                <p>USDT</p>
                                            </>
                                        )}
                                    </div>
                                )}
                                {key.includes("erc20:polygon") && (
                                    <div style={{ 
                                        display: "flex", 
                                        flexDirection: "column", 
                                        alignItems: "center", 
                                        justifyContent: "center", 
                                        gap: "1rem",
                                        position: "relative"
                                    }}>
                                        {/* Polygon icon in alto a destra */}
                                        <div style={{ 
                                            position: "absolute", 
                                            top: "-5px", 
                                            right: "-5px",
                                            backgroundColor: "#fff",
                                            borderRadius: "50%",
                                            padding: "2px",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                        }}>
                                            <PolygonIcon width={15} height={15} />
                                        </div>
                                        
                                        <UsdcIcon width={40} height={40} />
                                        <p>USDC</p>
                                    </div>
                                )}
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
