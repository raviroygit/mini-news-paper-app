import { createContext, ReactNode, useState, useEffect } from 'react';
import * as Network from 'expo-network';

type NetworkContextType = {
  isConnected: boolean;
};

export const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
});

type NetworkProviderProps = {
  children: ReactNode;
};

export function NetworkProvider({ children }: NetworkProviderProps) {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        setIsConnected(networkState.isConnected || false);
      } catch (error) {
        console.error('Error checking network connection:', error);
        setIsConnected(false);
      }
    };

    // Check connection on mount
    checkConnection();

    // Set up interval to check connection
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
}