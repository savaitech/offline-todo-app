import { storageLocalProvider } from "./storageLocal.provider";
import { StorageInterface } from "./storage.interface";

function StorageManager(type: 'local' | 'sqlite'): StorageInterface {
    switch (type) {
        case 'local':
            return storageLocalProvider;
        case 'sqlite': 
        // SQLLite is better , but for this project we will use AsyncStorage as POC 
            throw new Error('Not implemented yet');
        default:
            throw new Error('Invalid storage type');
    }
}

export default StorageManager('local');
