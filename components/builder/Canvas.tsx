'use client';

import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  sortedElementsAtom,
  selectedElementIdAtom,
  hoveredElementIdAtom,
  viewportModeAtom,
  reorderElementsAtom,
} from '@/store/builder';
import {
  AnnouncementBarElement,
  NavigationElement,
  HeroElement,
  FeaturesElement,
  TestimonialsElement,
  FAQElement,
  CTAElement,
  PaymentButtonElement,
  FooterElement,
  PricingElement,
  LeadFormElement,
  WhatsAppButtonElement,
  FormWithPaymentElement,
  BookingFormElement,
  ProductCarouselElement,
  MediaElement,
} from './elements';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Element, ElementType } from '@/types';

// Sortable Element Wrapper
interface SortableElementProps {
  element: Element;
  children: React.ReactNode;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
}

const SortableElement = ({
  element,
  children,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: SortableElementProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
      id={`${element.type}-${element.order}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onSelect}
    >
      {/* Drag Handle - Shows on hover or when selected */}
      {(isHovered || isSelected) && (
        <div
          {...attributes}
          {...listeners}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 z-10 cursor-grab active:cursor-grabbing bg-white border-2 rounded-xl p-2 shadow-lg ${
            isSelected ? 'border-[#5FC7CD]' : 'border-[#E2E8F0]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4 text-[#969696]" />
        </div>
      )}

      {/* Element border when selected/hovered */}
      <div
        className={`${
          isSelected
            ? 'ring-2 ring-[#5FC7CD] ring-offset-2'
            : isHovered
              ? 'ring-2 ring-[#E2E8F0] ring-offset-2'
              : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export const Canvas = () => {
  const elements = useAtomValue(sortedElementsAtom);
  const [selectedId, setSelectedId] = useAtom(selectedElementIdAtom);
  const [hoveredId, setHoveredId] = useAtom(hoveredElementIdAtom);
  const viewportMode = useAtomValue(viewportModeAtom);
  const reorderElements = useSetAtom(reorderElementsAtom);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Viewport widths
  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = elements.findIndex((el) => el.id === active.id);
    const newIndex = elements.findIndex((el) => el.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderElements({
        elementId: active.id as string,
        newOrder: newIndex,
      });
    }
  };

  const renderElement = (element: Element) => {
    const isSelected = selectedId === element.id;
    const isHovered = hoveredId === element.id;

    const commonProps = {
      isSelected,
      isHovered,
      onSelect: () => setSelectedId(element.id),
      onHover: (hovering: boolean) =>
        setHoveredId(hovering ? element.id : null),
      viewportMode,
    };

    let elementContent: React.ReactNode;

    switch (element.type as ElementType) {
      case 'announcement_bar':
        elementContent = (
          <AnnouncementBarElement
            props={element.props as any}
            {...commonProps}
          />
        );
        break;
      case 'navigation':
        elementContent = (
          <NavigationElement props={element.props as any} {...commonProps} />
        );
        break;
      case 'hero':
        elementContent = (
          <HeroElement props={element.props as any} {...commonProps} />
        );
        break;
      case 'features':
        elementContent = (
          <FeaturesElement props={element.props as any} {...commonProps} />
        );
        break;
      case 'testimonials':
        elementContent = (
          <TestimonialsElement props={element.props as any} {...commonProps} />
        );
        break;
      case 'faq':
        elementContent = (
          <FAQElement props={element.props as any} {...commonProps} />
        );
        break;
      case 'cta':
        elementContent = (
          <CTAElement props={element.props as any} {...commonProps} />
        );
        break;
      case 'pricing':
        elementContent = (
          <PricingElement props={element.props as any} {...commonProps} />
        );
        break;
      case 'payment_button':
        elementContent = (
          <PaymentButtonElement props={element.props as any} {...commonProps} />
        );
        break;
      case 'lead_form':
        elementContent = (
          <LeadFormElement props={element.props as any} {...commonProps} />
        );
        break;
      case 'whatsapp_button':
        elementContent = (
          <WhatsAppButtonElement
            props={element.props as any}
            {...commonProps}
          />
        );
        break;
      case 'form_with_payment':
        elementContent = (
          <FormWithPaymentElement
            props={element.props as any}
            {...commonProps}
          />
        );
        break;
      case 'booking_form':
        elementContent = (
          <BookingFormElement props={element.props as any} {...commonProps} />
        );
        break;
      case 'product_carousel':
        elementContent = (
          <ProductCarouselElement
            props={element.props as any}
            {...commonProps}
          />
        );
        break;
      case 'media':
        elementContent = (
          <MediaElement props={element.props as any} {...commonProps} />
        );
        break;
      case 'footer':
        elementContent = (
          <FooterElement props={element.props as any} {...commonProps} />
        );
        break;
      default:
        elementContent = (
          <div className="p-8 bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-xl text-center">
            <p className="text-[#969696]">
              Unknown element type: {element.type}
            </p>
          </div>
        );
    }

    return (
      <SortableElement
        key={element.id}
        element={element}
        isSelected={isSelected}
        isHovered={isHovered}
        onSelect={() => setSelectedId(element.id)}
        onHover={(hovering) => setHoveredId(hovering ? element.id : null)}
      >
        {elementContent}
      </SortableElement>
    );
  };

  // Handle canvas click (deselect)
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  return (
    <div
      className="flex-1 bg-[#F8FAFC] overflow-auto"
      onClick={handleCanvasClick}
    >
      {/* Canvas container with viewport simulation */}
      <div className="min-h-full flex items-start justify-center p-8">
        <div
          className="bg-white shadow-2xl transition-all duration-300 ease-in-out relative"
          style={{
            width: viewportWidths[viewportMode],
            minHeight: '100vh',
          }}
        >
          {elements.length === 0 ? (
            /* Empty state */
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center max-w-md px-4">
                <div className="w-24 h-24 bg-[#F8FAFC] rounded-full mx-auto mb-6 flex items-center justify-center border border-[#E2E8F0]">
                  <svg
                    className="w-12 h-12 text-[#969696]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#455263] mb-2">
                  Start Building
                </h3>
                <p className="text-[#969696]">
                  Add elements from the library on the left to start building
                  your page.
                </p>
              </div>
            </div>
          ) : (
            /* Render elements with drag-and-drop */
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={elements.map((el) => el.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="relative">{elements.map(renderElement)}</div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
};
