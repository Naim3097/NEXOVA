'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { currentProjectAtom } from '@/store/builder';
import { BuilderSidebar } from '@/components/builder/BuilderSidebar';
import { Toolbar } from '@/components/builder/Toolbar';
import { Canvas } from '@/components/builder/Canvas';
import { ElementLibrary } from '@/components/builder/ElementLibrary';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import type { Project } from '@/types';

export default function BuilderPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showGuestBanner, setShowGuestBanner] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const setCurrentProject = useSetAtom(currentProjectAtom);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setIsGuestMode(true);
        setShowGuestBanner(true);

        // Create a mock guest project so elements can be added
        const guestProject: Project = {
          id: 'guest-project',
          user_id: 'guest',
          name: 'Untitled Project',
          slug: 'guest-project',
          description: null,
          status: 'draft',
          element_count: 0,
          current_version: 1,
          published_url: null,
          seo_settings: {} as any,
          integrations: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setCurrentProject(guestProject);
      }
    }
  }, [user, loading, setCurrentProject]);

  const handleSignUp = () => {
    // Save current work to localStorage before redirecting
    localStorage.setItem('guestBuilderData', JSON.stringify({
      timestamp: Date.now(),
      message: 'Your work has been saved. Sign up to continue.',
    }));
    router.push('/signup?return=/builder');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <BuilderSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Builder Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Guest Mode Banner */}
        {isGuestMode && showGuestBanner && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    You're using Guest Mode
                  </p>
                  <p className="text-xs text-blue-700">
                    Sign up to save your work and publish your pages
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowGuestBanner(false)}
                  className="text-blue-900 hover:text-blue-950"
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  onClick={handleSignUp}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign Up Free
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <Toolbar
          projectId={isGuestMode ? 'guest-project' : undefined}
          projectName="Untitled Project"
          projectStatus="draft"
          isGuestMode={isGuestMode}
        />

        {/* Builder Canvas Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Element Library */}
          <ElementLibrary />

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-gray-50">
            <Canvas />
          </div>

          {/* Properties Panel */}
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}
