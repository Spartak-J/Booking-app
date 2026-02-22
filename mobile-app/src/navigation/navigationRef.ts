import { createNavigationContainerRef } from '@react-navigation/native';

import { RootStackParamList } from '@/navigation/RootNavigator';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigate = (...args: any[]) => {
  if (navigationRef.isReady()) {
    // TS typing around navigate overloads is noisy here; keep it permissive for external calls.
    (navigationRef.navigate as any)(...args);
  }
};
