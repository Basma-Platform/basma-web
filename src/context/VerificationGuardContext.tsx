import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import VerificationRequiredModal from '../components/shared/VerificationRequiredModal';

interface VerificationGuardPayload {
  featureName: string;
  reason?: string;
  benefits?: string[];
  redirectTo?: string;
}

interface VerificationGuardContextValue {
  requireVerification: (
    isVerified: boolean,
    payload: VerificationGuardPayload
  ) => boolean;
}

const VerificationGuardContext = createContext<
  VerificationGuardContextValue | undefined
>(undefined);

export const VerificationGuardProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    payload: VerificationGuardPayload | null;
  }>({ isOpen: false, payload: null });

  /**
   * ✅ Pure pass-through guard.
   * All name resolution happens INSIDE the modal.
   * Never mangles the payload.
   */
  const requireVerification = useCallback(
    (
      isVerified: boolean,
      payload: VerificationGuardPayload
    ): boolean => {
      if (isVerified) return true;
      setModalState({ isOpen: true, payload });
      return false;
    },
    []
  );

  const handleClose = useCallback(() => {
    setModalState({ isOpen: false, payload: null });
  }, []);

  return (
    <VerificationGuardContext.Provider value={{ requireVerification }}>
      {children}
      <VerificationRequiredModal
        isOpen={modalState.isOpen}
        onClose={handleClose}
        featureName={modalState.payload?.featureName ?? ''}
        reason={modalState.payload?.reason}
        benefits={modalState.payload?.benefits}
        redirectTo={modalState.payload?.redirectTo}
      />
    </VerificationGuardContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useVerificationGuard = () => {
  const ctx = useContext(VerificationGuardContext);
  if (!ctx) {
    throw new Error(
      'useVerificationGuard must be used inside <VerificationGuardProvider>'
    );
  }
  return ctx;
};