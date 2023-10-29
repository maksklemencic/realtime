// customAuthHook.tsx
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

export const useAuthProtection = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (!session) {
    // User is not authenticated; you can redirect or perform other actions here
    return { authorized: false };
  }

  return { authorized: true, session };
};