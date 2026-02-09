'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/auth-client';
import { loadProjectAtom } from '@/store/builder';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useAutoSaveVersion } from '@/hooks/useAutoSaveVersion';
import { BuilderSidebar } from '@/components/builder/BuilderSidebar';
import { Toolbar } from '@/components/builder/Toolbar';
import { ElementLibrary } from '@/components/builder/ElementLibrary';
import { Canvas } from '@/components/builder/Canvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
// import { BuilderWalkthrough } from '@/components/walkthrough';
import type { Project, Element } from '@/types';

// Error Boundary to catch and display errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; name: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; name: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `ErrorBoundary [${this.props.name}] caught error:`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 border border-red-500 rounded m-2">
          <p className="text-red-700 font-bold">Error in {this.props.name}:</p>
          <p className="text-red-600 text-sm">{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ProjectEditorPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const loadProject = useSetAtom(loadProjectAtom);

  // Disable auto-save - save only on manual button click
  // useAutoSave();

  // Disable auto-save version snapshots
  // useAutoSaveVersion(params.id as string | undefined);

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]); // Only run when ID changes, not on every render

  const fetchProject = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch project data
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;

      // Fetch project elements
      const { data: elementsData, error: elementsError } = await supabase
        .from('elements')
        .select('*')
        .eq('project_id', id)
        .order('order');

      if (elementsError) throw elementsError;

      // Debug: Log what we fetched from database
      console.log('Fetched elements from database:', {
        total: elementsData?.length || 0,
        types: elementsData?.map((el: any) => el.type) || [],
        ids: elementsData?.map((el: any) => el.id) || [],
      });

      // Deduplicate elements by ID (in case of database issues)
      const uniqueElements = (elementsData || []).reduce((acc, element) => {
        const exists = acc.find((el: Element) => el.id === element.id);
        if (!exists) {
          acc.push(element);
        } else {
          console.warn(
            'Duplicate element found in database:',
            element.id,
            element.type
          );
        }
        return acc;
      }, [] as Element[]);

      console.log('After deduplication:', {
        total: uniqueElements.length,
        types: uniqueElements.map((el: Element) => el.type),
      });

      // Load into builder state
      loadProject({
        project: projectData as Project,
        elements: uniqueElements,
      });
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5FC7CD] mx-auto mb-4"></div>
            <p className="text-[#969696]">Loading project...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="h-screen bg-[#F8FAFC] flex items-center justify-center">
          <Card className="max-w-md rounded-2xl border-[#E2E8F0]">
            <CardHeader>
              <CardTitle className="text-[#455263]">
                Error Loading Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#969696] mb-4">{error}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
                <Button
                  variant="teal"
                  onClick={() => router.push('/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  console.log('ProjectEditorPage: Rendering main layout');

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        {/* Builder Walkthrough temporarily disabled for debugging */}
        {/* <BuilderWalkthrough projectId={params.id as string} /> */}

        {/* Sidebar */}
        <ErrorBoundary name="BuilderSidebar">
          <BuilderSidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </ErrorBoundary>

        {/* Main Builder Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <ErrorBoundary name="Toolbar">
            <Toolbar />
          </ErrorBoundary>

          {/* Main builder interface */}
          <div className="flex-1 flex overflow-hidden">
            {/* Element Library */}
            <ErrorBoundary name="ElementLibrary">
              <div data-tour="elements-panel">
                <ElementLibrary />
              </div>
            </ErrorBoundary>

            {/* Canvas */}
            <ErrorBoundary name="Canvas">
              <div
                data-tour="canvas"
                className="flex-1 overflow-auto bg-[#F8FAFC]"
              >
                <Canvas />
              </div>
            </ErrorBoundary>

            {/* Properties Panel */}
            <ErrorBoundary name="PropertiesPanel">
              <div data-tour="properties-panel">
                <PropertiesPanel />
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
