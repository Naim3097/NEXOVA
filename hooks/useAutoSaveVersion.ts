import { useEffect, useRef } from 'react';

/**
 * Auto-save version snapshots every 15 minutes
 */
export function useAutoSaveVersion(projectId: string | undefined, enabled: boolean = true) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!projectId || !enabled) {
      return;
    }

    const AUTO_SAVE_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

    const createVersionSnapshot = async () => {
      try {
        const now = Date.now();
        const timeSinceLastSave = now - lastSaveRef.current;

        // Only save if 15 minutes have passed
        if (timeSinceLastSave < AUTO_SAVE_INTERVAL) {
          return;
        }

        const response = await fetch(`/api/projects/${projectId}/versions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            label: null,
            is_auto_save: true,
          }),
        });

        if (response.ok) {
          lastSaveRef.current = now;
          console.log('Auto-save version created');
        } else {
          console.error('Failed to create auto-save version');
        }
      } catch (error) {
        console.error('Error creating auto-save version:', error);
      }
    };

    // Create initial snapshot after 15 minutes
    intervalRef.current = setInterval(createVersionSnapshot, AUTO_SAVE_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [projectId, enabled]);

  return {
    lastSave: lastSaveRef.current,
  };
}
