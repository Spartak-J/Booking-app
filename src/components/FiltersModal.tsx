// Component: FiltersModal. Used in: HomeScreen.tsx, SearchResultsScreen.tsx.
import React, { useState } from 'react';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FiltersSheet } from '@/components/Filters/FiltersSheet';
import { OfferFilters } from '@/services/offerService';
import { City } from '@/types';

type Props = {
  visible: boolean;
  initialFilters: OfferFilters;
  onClose: () => void;
  onApply: (filters: OfferFilters) => void;
  cities?: City[];
};

export const FiltersModal: React.FC<Props> = ({ visible, initialFilters, onClose, onApply }) => {
  const [local, setLocal] = useState<OfferFilters>(initialFilters);

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const reset = () => {
    const cleared: OfferFilters = {
      onlyActive: initialFilters.onlyActive ?? true,
    };
    setLocal(cleared);
    onApply(cleared);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onShow={() => setLocal(initialFilters)}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <FiltersSheet
          filters={local}
          onChange={setLocal}
          onApply={handleApply}
          onClose={onClose}
          onReset={reset}
        />
      </SafeAreaView>
    </Modal>
  );
};
