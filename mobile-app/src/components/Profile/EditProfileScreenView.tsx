import React from 'react';

import AdminAccountScreenView from './AdminAccountScreenView';
import OwnerAccountScreenView from './OwnerAccountScreenView';
import UserAccountScreenView from './UserAccountScreenView';
import { ProfileFormValues } from '@/types/profile';

type EditProfileScreenViewProps = {
  initialValues: ProfileFormValues;
  isOwner: boolean;
  isAdmin: boolean;
  onBack: () => void;
  onPickAvatar?: () => Promise<string | undefined>;
  onSubmit: (values: ProfileFormValues) => void;
};

export const EditProfileScreenView: React.FC<EditProfileScreenViewProps> = ({
  initialValues,
  isOwner,
  isAdmin,
  onBack,
  onPickAvatar,
  onSubmit,
}) => {
  if (isAdmin) {
    return <AdminAccountScreenView initialValues={initialValues} onBack={onBack} onSubmit={onSubmit} />;
  }

  if (isOwner) {
    return (
      <OwnerAccountScreenView
        initialValues={initialValues}
        onBack={onBack}
        onPickAvatar={onPickAvatar}
        onSubmit={onSubmit}
      />
    );
  }

  return <UserAccountScreenView initialValues={initialValues} onBack={onBack} onSubmit={onSubmit} />;
};

export default EditProfileScreenView;
