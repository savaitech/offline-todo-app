import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const handleConnectivityChange = (state: NetInfoState) => {
            setIsConnected(state.isConnected ?? false);
        };

        const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

        // Fetch initial state
        NetInfo.fetch().then(handleConnectivityChange);

        return () => {
            unsubscribe();
        };
    }, []);

    return isConnected;
};

export default useNetworkStatus;