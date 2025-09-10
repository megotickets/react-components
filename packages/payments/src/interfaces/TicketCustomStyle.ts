import React from "react";

export interface TicketCustomStyle {
  // Container styles
  containerStyle?: React.CSSProperties;
  headerContainerStyle?: React.CSSProperties;
  paymentContainerStyle?: React.CSSProperties;
  locationContainerStyle?: React.CSSProperties;
  userNFTContainerStyle?: React.CSSProperties;

  // Background colors
  backgroundColor?: string;
  headerBackgroundColor?: string;
  paymentBackgroundColor?: string;
  locationBackgroundColor?: string;
  userNFTBackgroundColor?: string;

  // Text colors
  primaryTextColor?: string;
  secondaryTextColor?: string;
  titleTextColor?: string;
  subtitleTextColor?: string;

  // Border styles
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderRadius?: string;

  // Specific component styles
  bannerStyle?: React.CSSProperties;
  eventNameStyle?: React.CSSProperties;
  dateStyle?: React.CSSProperties;
  locationStyle?: React.CSSProperties;
  blockchainStyle?: React.CSSProperties;
  hostedByStyle?: React.CSSProperties;
  mintedInfoStyle?: React.CSSProperties;
  priceStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;

  // Icon colors
  iconColor?: string;

  // Map styles
  mapContainerStyle?: React.CSSProperties;

  // NFT styles
  nftContainerStyle?: React.CSSProperties;
  nftItemStyle?: React.CSSProperties;
}
