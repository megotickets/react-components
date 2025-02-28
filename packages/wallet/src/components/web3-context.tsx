import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import MegoModal from "./MegoModal";
import "./mego-style.css";
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserProvider, ethers } from "ethers";
import axios from "axios";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { disconnect } from 'wagmi/actions'
import { config } from "./Web3ClientProvider";

type Route =
  | "ChooseType"
  | "Email"
  | "Login"
  | "Register"
  | "Logged"
  | "TokenForPrivateKey" //Is section where user can insert token received from email (is for obtain private key)
  | "PrivateKey" //Is section where user can view his private key and copy it (export private key)
  | "LoginWithPasswordForPrivateKey" //Is section where user can login with email password to obtain private key
  | "ExportPrivateKey";

interface Web3ContextType {
  isMegoModalOpen: boolean; openMegoModal: () => void;
  redirectToGoogleLogin: () => void;
  redirectToAppleLogin: () => void;
  closeMegoModal: () => void;
  provider: string | null;
  walletConnectProvider: any;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithWalletConnect: () => Promise<void>;
  loggedAs: string | null;
  loadingText: string;
  setLoadingText: (text: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  section: Route;
  setSection: (section: Route) => void;
  prevSection: Route | undefined;
  setPrevSection: (section: Route | undefined) => void;
  logout: () => void;
  createNewWallet: (email: string, password: string) => Promise<void>; // Add the createNewWallet function to the context
  getProvider: () => any;
  getSigner: () => any;

  //Private key export
  requestExportPrivateKeyWithEmail: () => Promise<void>;
  requestExportPrivateKeyWithGoogle: () => Promise<void>;
  requestExportPrivateKeyWithApple: () => Promise<void>;
  revealPrivateKey: (token: string) => Promise<void>;
  privateKey: string | null;

  forceChainId: number;
  setForceChainId: (forceChainId: number) => void;

  //Firma con Apple
  signMessageWithApple: (origin: string, challange: string) => void;
  //Firma con Google
  signMessageWithGoogle: (origin: string, challange: string) => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const BASE_URL = "https://wallet.mego.tools";

export const useWeb3Context = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error(
      "useWeb3Context deve essere usato all'interno di un Web3Provider"
    );
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const { openConnectModal } = useConnectModal();
  const [section, setSection] = useState<Route>("ChooseType");
  const [prevSection, setPrevSection] = useState<Route | undefined>();
  const [isMegoModalOpen, setIsMegoModalOpen] = useState<boolean>(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [walletConnectProvider, setWalletConnectProvider] = useState<any>(null);
  const [noWalletConnectProvider, setNoWalletConnectProvider] = useState<any>(null);
  const [loggedAs, setLoggedAs] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("");

  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [forceChainId, setForceChainId] = useState<number>(0);
  const { address, isConnected } = useAccount();

  const openMegoModal = (): void => {
    setIsMegoModalOpen(true);
    setIsLoading(false); // Reset loading state when opening modal
  };

  useEffect(() => {
    if (address) {
      setLoggedAs(address);
      setSection("Logged");
      localStorage.setItem("loggedAs", address);
      setProvider("walletConnect");
    }
  }, [address]);

  useEffect(()=>{
    if(!isConnected){
      setLoggedAs(null);
      setProvider(null);
      setSection("ChooseType");
      localStorage.removeItem("loggedAs");
      localStorage.removeItem("provider");
    }
  },[isConnected, address])

  const closeMegoModal = (): void => {
    localStorage.setItem("isQuestionary", "false");
    setIsMegoModalOpen(false);
    setIsLoading(false); // Reset loading state when closing modal
  };

  function redirectToAppleLogin() {
    setIsLoading(true);
    localStorage.setItem("justLogged", "true");
    setTimeout(() => {
      window.location.href = BASE_URL + "/auth/apple" + "?origin="
        + window.location.href.replace("https://", "").replace("http://", "");
    }, 2500);
  }

  function redirectToGoogleLogin() {
    setIsLoading(true);
    localStorage.setItem("justLogged", "true");
    setTimeout(() => {
      window.location.href = BASE_URL + "/auth/google" + "?origin=" + window.location.href.replace("https://", "").replace("http://", "");
    }, 2500);
  }

  function redirectToQuestionary() {
    if (localStorage.getItem("isQuestionary") === "true") {
      openMegoModal();
    }
  }
  useEffect(() => {
    redirectToQuestionary();
  }, []);

  const logoutWalletConnect = async () => {
    try {
      // Utilizzo del hook di disconnect di wallet connect
      disconnect(config);
      setWalletConnectProvider(null);
      setProvider(null);
      setLoggedAs(null);
      localStorage.removeItem("provider");
      localStorage.removeItem("loggedAs");
    } catch (error) {
      console.error("Errore durante il logout da walletconnect:", error);
    }
  }

  function logout() {
    setProvider(null);
    setLoggedAs(null);
    logoutWalletConnect();
    localStorage.removeItem("provider");
    localStorage.removeItem("loggedAs");
    //console.log("[DEBUG]Effettuando il logout, loggedAs in localStorage:", localStorage.getItem("loggedAs"));
    window.history.replaceState(null, "", window.location.pathname);
  }


  //DEBUG
  useEffect(() => {
    //console.log("[DEBUG]loggedAs ripristinato:", loggedAs);
    //console.log("[DEBUG]provider ripristinato:", provider);
  }, [loggedAs, provider]);


  const getProvider = () => {
    if (provider === "walletConnect") {
      return walletConnectProvider;
    } else {
      return noWalletConnectProvider;
    }
  };

  //Firma con Apple 
  const signMessageWithApple = (origin: string, challange: string) => {
    localStorage.setItem("reddeemWithMego", "1");
    if (window)
      //@ts-expect-error typing bug
      window.location = `https://wallet.mego.tools/auth/apple?origin=${origin.replace("http://", "").replace("https://", "")}&message=${challange}`;
  };
  
  //Firma con Google
  const signMessageWithGoogle = (origin: string, challange: string) => {
    localStorage.setItem("redeemWithMego", "1");
    if (window)
      //@ts-expect-error typing bug
      window.location = `https://wallet.mego.tools/auth/google?origin=${origin.replace("http://", "").replace("https://", "")}&message=${challange}`;
  };

  const getSigner = async () => {
    if (provider === "walletConnect" && walletConnectProvider) {
      const signer = await walletConnectProvider.getSigner();
      return signer;
    } else {
      // Per Google e altri provider non-walletConnect, creiamo un signer personalizzato
      return {
        getAddress: async () => loggedAs,
        signMessage: async (message: string) => {
          //TODO: Mego backend sign message function
          throw new Error("Signing not supported for this provider");
        },
        sendTransaction: async (transaction: any) => {
          const provider = getProvider();
          return provider.sendTransaction(transaction);
        },
        connect: (provider: any) => {
          return provider;
        }
      };
    }
  };

  const loginWithWalletConnect = async () => {
    setLoadingText("Checking walletconnect ...");
    if (!(window as any).ethereum) {
      alert("walletConnect is not installed");
      return;
    }
    try {
      const _provider = new BrowserProvider((window as any).ethereum);
      await _provider.send("eth_requestAccounts", []);
      const signer = await _provider.getSigner();
      const address = await signer.getAddress();

      // Prima settiamo il provider e l'indirizzo
      setProvider("walletConnect");
      setWalletConnectProvider(_provider);

      // Poi aggiorniamo lo stato e il localStorage
      setLoggedAs(address);
      localStorage.setItem("loggedAs", address);
      localStorage.setItem("provider", "walletConnect");

      // Cambiamo la sezione a "Logged"
      setSection("Logged");

      if (forceChainId && forceChainId !== 0) {
        await _provider.send("wallet_switchEthereumChain", [{
          chainId: `0x${forceChainId.toString(16)}`
        }]);
      }
    } catch (error) {
      console.error("Error initializing provider:", error);
      console.log(error);
    } finally {
      setIsLoading(false);
      setLoadingText("");
    }
  };


  const loginWithEmail = async (email: string, password: string) => {
    const lowerCaseEmail = email.toLowerCase();
    setLoadingText("Checking email and password");

    const check = await axios.post(`${BASE_URL}/wallets/check`, {
      email: lowerCaseEmail,
      password: password,
    });

    if (check.data.error === false) {
      setIsLoading(false);
      setLoadingText("");
      setLoggedAs(check.data.addresses.eth);
      localStorage.setItem("loggedAs", check.data.addresses.eth);
      localStorage.setItem("provider", "email");
      localStorage.setItem("email", email);
      setProvider("email");
    } else {
      setLoadingText("");
      alert(check.data.message);
      setIsLoading(false);
    }
  };

  // Aggiungi la funzione per creare un nuovo wallet

  async function createNewWallet(email: string, password: string) {
    if (!isLoading) {
      setIsLoading(true);
      setLoadingText("Creating new mego wallet");
      const lowerCaseEmail = email.toLowerCase();
      const create = await axios.post(`${BASE_URL}/wallets/email/new`, {
        email: lowerCaseEmail,
        password: password,
      });
      if (!create.data.error) {
        await loginWithEmail(email, password);
      } else {
        alert(create.data.message);
        setIsLoading(false);
        setLoadingText("");
      }
    }
  }

  useEffect(() => {
    //console.log("[DEBUG] Executing useEffect");
    const searchParams = new URLSearchParams(window.location.search);
    const urlProvider = searchParams.get("provider");
    let urlLoggedAs = searchParams.get("loggedAs") || searchParams.get("signedAs");
    const exported = searchParams.get("exported");
    //# 1
    if (urlProvider) {
      //console.log("[DEBUG] #1 - urlProvider:", urlProvider);
      setProvider(urlProvider);
      localStorage.setItem("provider", urlProvider);

      // Inizializza il provider JSON-RPC per Google
      if (urlProvider === 'google') {
        const jsonRpcProvider = new ethers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC_PROVIDER);
        setNoWalletConnectProvider(jsonRpcProvider);
      }

      if (exported) {
        openMegoModal();
      }
    }

    //# 2
    if (urlLoggedAs) {
      //console.log("[DEBUG] #2 - urlLoggedAs:", urlLoggedAs);
      setLoggedAs(urlLoggedAs);
      localStorage.setItem("loggedAs", urlLoggedAs);
    }

    //# 3
    if (!urlProvider && !urlLoggedAs) {
      //console.log("[DEBUG] #3 - !urlProvider && !urlLoggedAs");
      const storedProvider = localStorage.getItem("provider");
      const storedLoggedAs = localStorage.getItem("loggedAs");
      //console.log("[DEBUG] #3 - storedProvider:", storedProvider);
      //console.log("[DEBUG] #3 - storedLoggedAs:", storedLoggedAs);
      if (storedProvider) {
        setProvider(storedProvider);
        // Inizializza il provider anche per sessioni ripristinate
        if (storedProvider === 'google') {
          const jsonRpcProvider = new ethers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC_PROVIDER);
          setNoWalletConnectProvider(jsonRpcProvider);
        } else if (storedProvider === 'walletConnect') {
          loginWithWalletConnect();
        }
      }
      if (storedLoggedAs) setLoggedAs(storedLoggedAs);
    }

    //# 4
    if (urlProvider === 'google' && urlLoggedAs) {
      //console.log("[DEBUG] #4 - urlProvider === 'google' && urlLoggedAs");
      try {
        const jsonRpcProvider = new ethers.JsonRpcProvider("https://base-sepolia.g.alchemy.com/v2/KxxtZXKplWuSt71LXxy-9Mr4BhucrqEP");
        setNoWalletConnectProvider(jsonRpcProvider);
        setProvider('google');
        setLoggedAs(urlLoggedAs);
        localStorage.setItem("provider", 'google');
        localStorage.setItem("loggedAs", urlLoggedAs);
      } catch (error) {
        console.error("[Google Auth] Error initializing provider:", error);
      }
    }

  }, []);

  //Handle chain change
  useEffect(() => {
    const handleChainChanged = async (chainId: string) => {
      if (forceChainId == 0) {
        return;
      }
      const targetChainId = `0x${Number(forceChainId).toString(16)}`;
      // Verifica se la chain è diversa da quella target
      if (chainId !== targetChainId) {
        try {
          // Richiedi il cambio di rete
          //@ts-ignore
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }],
          });
        } catch (error) {
          alert("Errore nel cambio rete:" + error);
        }
      }
    };

    // Aggiungi il listener per il cambio chain
    //@ts-ignore
    window.ethereum?.on('chainChanged', handleChainChanged);

    // Cleanup del listener
    return () => {
      //@ts-ignore
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [forceChainId]);


  //Usando windows.etherium verificiamo se l'address del wallet cambia (in caso di cambiamento refresh)
  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        // Invece di ricaricare la pagina, aggiorniamo lo stato
        const _provider = new BrowserProvider((window as any).ethereum);
        const signer = await _provider.getSigner();
        const address = await signer.getAddress();
        setLoggedAs(address);
        localStorage.setItem("loggedAs", address);
        setSection("Logged");
      } else {
        // Se non ci sono account, facciamo logout
        logout();
      }
    };

    (window as any).ethereum?.on('accountsChanged', handleAccountsChanged);
    return () => {
      (window as any).ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);


  //Private key export
  const requestExportPrivateKeyWithEmail = async () => {
    setIsLoading(true);
    setSection("TokenForPrivateKey");
  }

  const requestExportPrivateKeyWithGoogle = async () => {
    setIsLoading(true);

    //Redirect for request token via google auth
    setTimeout(() => {
      window.location.href = BASE_URL + "/auth/google" + "?origin=" + window.location.href.split('?')[0].replace("https://", "").replace("http://", "") + "&message=EXPORT_WALLET";
    }, 2500);

  }

  const requestExportPrivateKeyWithApple = async () => {
    setIsLoading(true);
    setSection("TokenForPrivateKey");
  }

  const revealPrivateKey = async (token: string) => {
    setIsLoading(true);
    setLoadingText("Revealing private key...");
    //POST with axios
    const reveal = await axios.post(`${BASE_URL}/wallets/export`, { token: token })
    if (reveal.data.error) {
      setLoadingText(reveal.data.message);
      alert(reveal.data.message);
      setIsLoading(false);
      setLoadingText("");
      setTimeout(() => {
        //Back to previous page
        window.history.back();
      }, 1000);
    } else {
      setIsLoading(false);
      setPrivateKey(reveal.data.private_keys.eth);
      //Append privateKeyVisible to url (without reloading page and suppress other params)
      const url = new URL(window.location.href);
      url.searchParams.set("privateKeyVisible", "true");
      window.history.pushState({}, '', url.toString());
      setSection("PrivateKey");
    }
  }


  const value: Web3ContextType = {
    getProvider, getSigner, isMegoModalOpen, openMegoModal,
    redirectToAppleLogin, redirectToGoogleLogin, closeMegoModal, provider, walletConnectProvider, loginWithWalletConnect, section,
    setSection, prevSection, setPrevSection, loggedAs, isLoading, logout, setIsLoading, loadingText, setLoadingText, loginWithEmail, createNewWallet,
    requestExportPrivateKeyWithEmail, requestExportPrivateKeyWithGoogle, requestExportPrivateKeyWithApple, revealPrivateKey, privateKey,
    forceChainId, setForceChainId, signMessageWithApple, signMessageWithGoogle
  };
  return (
      <Web3Context.Provider value={value}>
        {children}
        {isMegoModalOpen && <MegoModal isOpen={isMegoModalOpen} onClose={closeMegoModal} />}
      </Web3Context.Provider>
  );
};

export type { Route };