import { useEffect, useRef } from 'react';
import { tripPayloadHash } from '../utils/tripMapper';

const AUTOSAVE_MS = 3000;

/**
 * Debounced auto-save — skips duplicate payloads
 */
export const useTripAutosave = (activeTrip, user, saveFn, onStatus) => {
  const hashRef = useRef('');
  const timerRef = useRef(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!activeTrip?.id || !user?.uid) return;

    const hash = tripPayloadHash({ ...activeTrip, userId: user.uid });
    if (hash === hashRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    onStatus?.('pending');

    timerRef.current = setTimeout(async () => {
      if (savingRef.current) return;
      savingRef.current = true;
      onStatus?.('saving');

      try {
        await saveFn(activeTrip.id, activeTrip, user);
        hashRef.current = hash;
        onStatus?.('saved');
      } catch (err) {
        onStatus?.('error', err);
      } finally {
        savingRef.current = false;
      }
    }, AUTOSAVE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeTrip, user, saveFn, onStatus]);
};
