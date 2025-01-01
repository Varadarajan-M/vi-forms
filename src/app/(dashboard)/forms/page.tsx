import Forms from '@/components/pages/dashboard/forms/Forms';
import { prefetchFormsServer } from '@/data-fetching/server/form';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';

const FormPage = async () => {
  const queryClient = await prefetchFormsServer();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Forms />
    </HydrationBoundary>
  );
};

export default FormPage;