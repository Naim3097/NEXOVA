import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Project, Element } from '@/types';

// ============================================================================
// CORE STATE ATOMS
// ============================================================================

/**
 * Current project being edited
 */
export const currentProjectAtom = atom<Project | null>(null);

/**
 * All elements in the current project, ordered by the 'order' field
 */
export const elementsAtom = atom<Element[]>([]);

/**
 * Currently selected element ID (for editing)
 */
export const selectedElementIdAtom = atom<string | null>(null);

/**
 * Hover state for elements (for visual feedback)
 */
export const hoveredElementIdAtom = atom<string | null>(null);

// ============================================================================
// CANVAS STATE
// ============================================================================

/**
 * Canvas viewport state (for zoom/pan in the future)
 */
export const canvasStateAtom = atomWithStorage('builder-canvas-state', {
  zoom: 100, // percentage
  offsetX: 0,
  offsetY: 0,
});

/**
 * Canvas view mode (desktop, tablet, mobile)
 */
export const viewportModeAtom = atomWithStorage<'desktop' | 'tablet' | 'mobile'>(
  'builder-viewport-mode',
  'desktop'
);

// ============================================================================
// HISTORY STATE (Undo/Redo)
// ============================================================================

/**
 * History stack for undo/redo functionality
 */
export const historyAtom = atom<{
  past: Element[][];
  present: Element[];
  future: Element[][];
}>({
  past: [],
  present: [],
  future: [],
});

/**
 * Derived atom: Can undo?
 */
export const canUndoAtom = atom((get) => {
  const history = get(historyAtom);
  return history.past.length > 0;
});

/**
 * Derived atom: Can redo?
 */
export const canRedoAtom = atom((get) => {
  const history = get(historyAtom);
  return history.future.length > 0;
});

// ============================================================================
// SAVE STATE
// ============================================================================

/**
 * Save state tracking
 */
export const saveStateAtom = atom<{
  status: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSaved: Date | null;
  error: string | null;
}>({
  status: 'saved',
  lastSaved: null,
  error: null,
});

/**
 * Has unsaved changes?
 */
export const hasUnsavedChangesAtom = atom((get) => {
  const saveState = get(saveStateAtom);
  return saveState.status === 'unsaved';
});

// ============================================================================
// UI STATE
// ============================================================================

/**
 * Left sidebar state (element library)
 */
export const leftSidebarOpenAtom = atomWithStorage('builder-left-sidebar-open', true);

/**
 * Right sidebar state (properties panel)
 */
export const rightSidebarOpenAtom = atomWithStorage(
  'builder-right-sidebar-open',
  true
);

/**
 * Loading state
 */
export const builderLoadingAtom = atom<boolean>(false);

// ============================================================================
// DERIVED ATOMS
// ============================================================================

/**
 * Get currently selected element
 */
export const selectedElementAtom = atom((get) => {
  const selectedId = get(selectedElementIdAtom);
  const elements = get(elementsAtom);
  return elements.find((el) => el.id === selectedId) || null;
});

/**
 * Get elements sorted by order
 */
export const sortedElementsAtom = atom((get) => {
  const elements = get(elementsAtom);
  return [...elements].sort((a, b) => a.order - b.order);
});

/**
 * Get element count
 */
export const elementCountAtom = atom((get) => {
  const elements = get(elementsAtom);
  return elements.length;
});

// ============================================================================
// WRITE-ONLY ATOMS (Actions)
// ============================================================================

/**
 * Add a new element to the canvas
 */
export const addElementAtom = atom(
  null,
  (get, set, element: Omit<Element, 'id' | 'created_at' | 'updated_at'>) => {
    const elements = get(elementsAtom);
    const newElement: Element = {
      ...element,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to history before changing
    const history = get(historyAtom);
    set(historyAtom, {
      past: [...history.past, elements],
      present: [...elements, newElement],
      future: [],
    });

    set(elementsAtom, [...elements, newElement]);
    set(saveStateAtom, { status: 'unsaved', lastSaved: null, error: null });
  }
);

/**
 * Update an existing element
 */
export const updateElementAtom = atom(
  null,
  (
    get,
    set,
    payload: { id: string; props?: Record<string, any>; order?: number }
  ) => {
    const elements = get(elementsAtom);
    const elementIndex = elements.findIndex((el) => el.id === payload.id);

    if (elementIndex === -1) return;

    // Add to history before changing
    const history = get(historyAtom);
    set(historyAtom, {
      past: [...history.past, elements],
      present: elements,
      future: [],
    });

    const updatedElements = [...elements];
    updatedElements[elementIndex] = {
      ...updatedElements[elementIndex],
      ...(payload.props && { props: payload.props }),
      ...(payload.order !== undefined && { order: payload.order }),
      updated_at: new Date().toISOString(),
      version: updatedElements[elementIndex].version + 1,
    };

    set(elementsAtom, updatedElements);
    set(saveStateAtom, { status: 'unsaved', lastSaved: null, error: null });
  }
);

/**
 * Delete an element
 */
export const deleteElementAtom = atom(null, (get, set, elementId: string) => {
  const elements = get(elementsAtom);

  // Add to history before changing
  const history = get(historyAtom);
  set(historyAtom, {
    past: [...history.past, elements],
    present: elements,
    future: [],
  });

  const updatedElements = elements.filter((el) => el.id !== elementId);

  // Reorder remaining elements
  const reorderedElements = updatedElements.map((el, index) => ({
    ...el,
    order: index,
  }));

  set(elementsAtom, reorderedElements);
  set(saveStateAtom, { status: 'unsaved', lastSaved: null, error: null });

  // Clear selection if deleted element was selected
  const selectedId = get(selectedElementIdAtom);
  if (selectedId === elementId) {
    set(selectedElementIdAtom, null);
  }
});

/**
 * Reorder elements (for drag-and-drop)
 */
export const reorderElementsAtom = atom(
  null,
  (get, set, payload: { elementId: string; newOrder: number }) => {
    const elements = get(elementsAtom);

    // Add to history before changing
    const history = get(historyAtom);
    set(historyAtom, {
      past: [...history.past, elements],
      present: elements,
      future: [],
    });

    const elementIndex = elements.findIndex((el) => el.id === payload.elementId);
    if (elementIndex === -1) return;

    const updatedElements = [...elements];
    const [movedElement] = updatedElements.splice(elementIndex, 1);
    updatedElements.splice(payload.newOrder, 0, movedElement);

    // Update order values
    const reorderedElements = updatedElements.map((el, index) => ({
      ...el,
      order: index,
    }));

    set(elementsAtom, reorderedElements);
    set(saveStateAtom, { status: 'unsaved', lastSaved: null, error: null });
  }
);

/**
 * Undo action
 */
export const undoAtom = atom(null, (get, set) => {
  const history = get(historyAtom);

  if (history.past.length === 0) return;

  const previous = history.past[history.past.length - 1];
  const newPast = history.past.slice(0, -1);

  set(historyAtom, {
    past: newPast,
    present: previous,
    future: [history.present, ...history.future],
  });

  set(elementsAtom, previous);
  set(saveStateAtom, { status: 'unsaved', lastSaved: null, error: null });
});

/**
 * Redo action
 */
export const redoAtom = atom(null, (get, set) => {
  const history = get(historyAtom);

  if (history.future.length === 0) return;

  const next = history.future[0];
  const newFuture = history.future.slice(1);

  set(historyAtom, {
    past: [...history.past, history.present],
    present: next,
    future: newFuture,
  });

  set(elementsAtom, next);
  set(saveStateAtom, { status: 'unsaved', lastSaved: null, error: null });
});

/**
 * Duplicate an element
 */
export const duplicateElementAtom = atom(null, (get, set, elementId: string) => {
  const elements = get(elementsAtom);
  const element = elements.find((el) => el.id === elementId);

  if (!element) return;

  const newElement: Element = {
    ...element,
    id: crypto.randomUUID(),
    order: element.order + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Add to history before changing
  const history = get(historyAtom);
  set(historyAtom, {
    past: [...history.past, elements],
    present: elements,
    future: [],
  });

  // Insert after the original element
  const updatedElements = [...elements];
  updatedElements.splice(element.order + 1, 0, newElement);

  // Reorder all elements after the insertion point
  const reorderedElements = updatedElements.map((el, index) => ({
    ...el,
    order: index,
  }));

  set(elementsAtom, reorderedElements);
  set(saveStateAtom, { status: 'unsaved', lastSaved: null, error: null });
  set(selectedElementIdAtom, newElement.id);
});

/**
 * Clear all elements (used when loading new project)
 */
export const clearElementsAtom = atom(null, (get, set) => {
  set(elementsAtom, []);
  set(selectedElementIdAtom, null);
  set(hoveredElementIdAtom, null);
  set(historyAtom, { past: [], present: [], future: [] });
  set(saveStateAtom, { status: 'saved', lastSaved: null, error: null });
});

/**
 * Load project data into builder state
 */
export const loadProjectAtom = atom(
  null,
  (get, set, payload: { project: Project; elements: Element[] }) => {
    set(currentProjectAtom, payload.project);
    set(elementsAtom, payload.elements);
    set(selectedElementIdAtom, null);
    set(hoveredElementIdAtom, null);
    set(historyAtom, {
      past: [],
      present: payload.elements,
      future: [],
    });
    set(saveStateAtom, {
      status: 'saved',
      lastSaved: new Date(),
      error: null,
    });
  }
);
