import { useEffect, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  elementsAtom,
  saveStateAtom,
  currentProjectAtom,
  hasUnsavedChangesAtom,
} from '@/store/builder';
import { supabase } from '@/lib/supabase/auth-client';

const AUTO_SAVE_DELAY = 2000; // 2 seconds debounce

export const useAutoSave = () => {
  const elements = useAtomValue(elementsAtom);
  const currentProject = useAtomValue(currentProjectAtom);
  const hasUnsavedChanges = useAtomValue(hasUnsavedChangesAtom);
  const [saveState, setSaveState] = useAtom(saveStateAtom);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef<boolean>(false); // Prevent concurrent saves

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't save if no unsaved changes or no project
    if (!hasUnsavedChanges || !currentProject) {
      return;
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      // Prevent concurrent saves
      if (isSavingRef.current) {
        return;
      }

      try {
        isSavingRef.current = true;
        setSaveState({ status: 'saving', lastSaved: null, error: null });

        // Save all elements to database
        // First, delete all existing elements for this project
        const { error: deleteError } = await supabase
          .from('elements')
          .delete()
          .eq('project_id', currentProject.id);

        if (deleteError) throw deleteError;

        // Then insert the new elements (deduplicate by ID first)
        if (elements.length > 0) {
          const uniqueElements = elements.reduce((acc, el) => {
            const exists = acc.find((item) => item.id === el.id);
            if (!exists) {
              acc.push(el);
            }
            return acc;
          }, [] as typeof elements);

          const { error: insertError } = await supabase
            .from('elements')
            .insert(
              uniqueElements.map((el) => ({
                id: el.id,
                project_id: el.project_id,
                type: el.type,
                order: el.order,
                props: el.props,
                version: el.version,
                created_at: el.created_at,
                updated_at: new Date().toISOString(),
              }))
            );

          if (insertError) throw insertError;
        }

        // Update project's updated_at and element_count
        const { error: projectError } = await supabase
          .from('projects')
          .update({
            element_count: elements.length,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentProject.id);

        if (projectError) throw projectError;

        // Success!
        setSaveState({
          status: 'saved',
          lastSaved: new Date(),
          error: null,
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveState({
          status: 'error',
          lastSaved: null,
          error: error instanceof Error ? error.message : 'Save failed',
        });
      } finally {
        isSavingRef.current = false;
      }
    }, AUTO_SAVE_DELAY);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [elements, currentProject, hasUnsavedChanges, setSaveState]);

  // Manual save function
  const saveNow = async () => {
    if (!currentProject) return;

    // Prevent concurrent saves
    if (isSavingRef.current) {
      return { success: false, error: 'Save already in progress' };
    }

    try {
      isSavingRef.current = true;
      setSaveState({ status: 'saving', lastSaved: null, error: null });

      // Delete and re-insert elements
      const { error: deleteError } = await supabase
        .from('elements')
        .delete()
        .eq('project_id', currentProject.id);

      if (deleteError) throw deleteError;

      if (elements.length > 0) {
        // Deduplicate elements by ID before inserting
        const uniqueElements = elements.reduce((acc, el) => {
          const exists = acc.find((item) => item.id === el.id);
          if (!exists) {
            acc.push(el);
          }
          return acc;
        }, [] as typeof elements);

        const { error: insertError } = await supabase
          .from('elements')
          .insert(
            uniqueElements.map((el) => ({
              id: el.id,
              project_id: el.project_id,
              type: el.type,
              order: el.order,
              props: el.props,
              version: el.version,
              created_at: el.created_at,
              updated_at: new Date().toISOString(),
            }))
          );

        if (insertError) throw insertError;
      }

      const { error: projectError } = await supabase
        .from('projects')
        .update({
          element_count: elements.length,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentProject.id);

      if (projectError) throw projectError;

      setSaveState({
        status: 'saved',
        lastSaved: new Date(),
        error: null,
      });

      return { success: true };
    } catch (error) {
      console.error('Manual save failed:', error);
      setSaveState({
        status: 'error',
        lastSaved: null,
        error: error instanceof Error ? error.message : 'Save failed',
      });
      return { success: false, error };
    } finally {
      isSavingRef.current = false;
    }
  };

  return {
    saveState,
    saveNow,
  };
};
