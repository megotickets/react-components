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
import { isConnectedWithMego } from "@/utils/utils";
import "../css/pay.css";

export const PaymentsCollectors = () => {
    const { eventDetails, processor, setProcessor } = useBuyTicketContext();
    const [selectedProcessor, setSelectedProcessor] = useState<string>('stripe');
    const [userConnectedWithMego, setSetUserConnectedWithMego] = useState<boolean>(false);

    if (!eventDetails || eventDetails?.event?.collectors?.length === 0 || !eventDetails?.event?.collectors) {
        return;
    }

    if (eventDetails?.event?.price === 0) {
        return;
    }

    // Sposta la logica MEgo in un useEffect
    useEffect(() => {
        if (isConnectedWithMego() && eventDetails?.event?.price > 0) {
            setSetUserConnectedWithMego(true);
        }
    }, [eventDetails?.event?.price]);

    useEffect(() => {
        setProcessor(selectedProcessor);
    }, []);

    useEffect(() => {
        setSelectedProcessor(processor || 'stripe');
    }, [processor]);

    return (
        <div className="ticket-collectors-container">
            {
                Object.entries(eventDetails?.event?.collectors || {}).sort(([keyA], [keyB]) => keyA === "stripe" ? -1 : keyB === "stripe" ? 1 : 0).map(([key, value]) => {
                    return (
                        <div key={key} className="ticket-collector-item-container">
                            <div
                                onClick={() => {
                                    console.log("Settato il processor a: ", key)
                                    if (!userConnectedWithMego || (userConnectedWithMego && key === "stripe")) {
                                        setProcessor(key)
                                    }
                                }}
                                className="ticket-collector-item"
                                style={{ border: selectedProcessor === key ? "2px solid #007bff" : "none" }}
                            >
                                {key === "stripe" &&
                                    <div className="ticket-collector-icon">
                                        <StripeIcon width={40} height={40} />
                                        <p className="font-satoshi">Card</p>
                                    </div>}
                                {key === "ethereum" &&
                                    <div
                                        className="ticket-collector-icon"
                                        style={{ opacity: userConnectedWithMego ? "0.5" : "1", cursor: userConnectedWithMego ? "not-allowed" : "pointer" }}>
                                        <EtheriumIcon width={40} height={40} />
                                        <p className="font-satoshi">Ethereum</p>
                                    </div>}
                                {key === "arbitrum" &&
                                    <div
                                        className="ticket-collector-icon"
                                        style={{ opacity: userConnectedWithMego ? "0.5" : "1", cursor: userConnectedWithMego ? "not-allowed" : "pointer" }}>
                                        <ArbitrumIcon width={40} height={40} />
                                        <p className="font-satoshi">Arbitrum</p>
                                    </div>}
                                {key === "polygon" &&
                                    <div
                                        className="ticket-collector-icon"
                                        style={{ opacity: userConnectedWithMego ? "0.5" : "1", cursor: userConnectedWithMego ? "not-allowed" : "pointer" }}>
                                        <PolygonIcon width={40} height={40} />
                                        <p className="font-satoshi">Polygon</p>
                                    </div>}
                                {key.includes("erc20:ethereum") && (
                                    <div
                                        className="ticket-collector-icon"
                                        style={{
                                            position: "relative",
                                            opacity: userConnectedWithMego ? "0.5" : "1",
                                            cursor: userConnectedWithMego ? "not-allowed" : "pointer"
                                        }}>
                                        {/* Ethereum icon in alto a destra */}
                                        <div
                                            className="ticket-collector-top-icon-container"
                                            style={{
                                                opacity: userConnectedWithMego ? "0.5" : "1",
                                                cursor: userConnectedWithMego ? "not-allowed" : "pointer"
                                            }}>
                                            <EtheriumIcon width={15} height={15} />
                                        </div>

                                        {/* USDC su Ethereum */}
                                        {key.includes("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") && (
                                            <div
                                                className="ticket-collector-icon"
                                                style={{ opacity: userConnectedWithMego ? "0.5" : "1", cursor: userConnectedWithMego ? "not-allowed" : "pointer" }}>
                                                <UsdcIcon width={40} height={40} />
                                                <p className="font-satoshi">USDC</p>
                                            </div>
                                        )}

                                        {/* DAI su Ethereum */}
                                        {key.includes("0x6b175474e89094c44da98b954eedeac495271d0f") && (
                                            <div
                                                className="ticket-collector-icon"
                                                style={{ opacity: userConnectedWithMego ? "0.5" : "1", cursor: userConnectedWithMego ? "not-allowed" : "pointer" }}>
                                                <DaiIcons width={40} height={40} />
                                                <p className="font-satoshi">DAI</p>
                                            </div>
                                        )}

                                        {/* USDT su Ethereum */}
                                        {key.includes("0xdac17f958d2ee523a2206206994597c13d831ec7") && (
                                            <div
                                                className="ticket-collector-icon"
                                                style={{ opacity: userConnectedWithMego ? "0.5" : "1", cursor: userConnectedWithMego ? "not-allowed" : "pointer" }}>
                                                <USDTIcon width={40} height={40} />
                                                <p className="font-satoshi">USDT</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {key.includes("erc20:polygon") && (
                                    <div
                                        className="ticket-collector-icon"
                                        style={{
                                            position: "relative",
                                            opacity: userConnectedWithMego ? "0.5" : "1",
                                            cursor: userConnectedWithMego ? "not-allowed" : "pointer"
                                        }}>
                                        {/* Polygon icon in alto a destra */}
                                        <div
                                            className="ticket-collector-top-icon-container"
                                            style={{
                                                opacity: userConnectedWithMego ? "0.5" : "1",
                                                cursor: userConnectedWithMego ? "not-allowed" : "pointer"
                                            }}>
                                            <PolygonIcon width={15} height={15} />
                                        </div>

                                        <UsdcIcon width={40} height={40} />
                                        <p className="font-satoshi">USDC</p>
                                    </div>
                                )}
                                {key === "optimism" &&
                                    <div
                                        className="ticket-collector-icon"
                                        style={{ opacity: userConnectedWithMego ? "0.5" : "1", cursor: userConnectedWithMego ? "not-allowed" : "pointer" }}>
                                        <OptimismIcon width={40} height={40} />
                                        <p className="font-satoshi">Optimism</p>
                                    </div>}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
