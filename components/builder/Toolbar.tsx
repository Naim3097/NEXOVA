'use client';

import React, { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  currentProjectAtom,
  viewportModeAtom,
  canUndoAtom,
  canRedoAtom,
  undoAtom,
  redoAtom,
  saveStateAtom,
  leftSidebarOpenAtom,
  rightSidebarOpenAtom,
  elementsAtom,
  loadProjectAtom,
} from '@/store/builder';
import { profileAtom } from '@/store/auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/auth-client';
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Eye,
  Settings,
  PanelLeft,
  PanelRight,
  BarChart3,
  FileText,
  ChevronDown,
  Search,
  Clock,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { PublishDialog } from './PublishDialog';
import { SEOSettingsDialog } from '@/components/seo/SEOSettingsDialog';
import { VersionHistorySidebar } from '@/components/versions/VersionHistorySidebar';
import { ProjectTrackingPixelsDialog } from './ProjectTrackingPixelsDialog';
import {
  ProjectSettingsDialog,
  ImportedProjectData,
} from './ProjectSettingsDialog';

interface ToolbarProps {
  projectId?: string;
  projectName?: string;
  projectStatus?: 'draft' | 'published';
  isGuestMode?: boolean;
}

export const Toolbar = ({
  projectId,
  projectName,
  projectStatus,
  isGuestMode = false,
}: ToolbarProps = {}) => {
  const currentProject = useAtomValue(currentProjectAtom);
  const profile = useAtomValue(profileAtom);
  const elements = useAtomValue(elementsAtom);
  const [viewportMode, setViewportMode] = useAtom(viewportModeAtom);
  const [leftSidebarOpen, setLeftSidebarOpen] = useAtom(leftSidebarOpenAtom);
  const [rightSidebarOpen, setRightSidebarOpen] = useAtom(rightSidebarOpenAtom);
  const canUndo = useAtomValue(canUndoAtom);
  const canRedo = useAtomValue(canRedoAtom);
  const undo = useSetAtom(undoAtom);
  const redo = useSetAtom(redoAtom);
  const loadProject = useSetAtom(loadProjectAtom);
  const [saveState, setSaveState] = useAtom(saveStateAtom);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [seoDialogOpen, setSeoDialogOpen] = useState(false);
  const [trackingPixelsDialogOpen, setTrackingPixelsDialogOpen] =
    useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [projectSettingsOpen, setProjectSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRepublishing, setIsRepublishing] = useState(false);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleSave = async (
    customName?: string,
    customDescription?: string
  ) => {
    if (isGuestMode) {
      alert('Sign up to save your work!');
      return;
    }

    if (!currentProject) {
      console.error('No project to save');
      alert('No project loaded');
      return;
    }

    // Check if this is a temporary project and we need to ask for a name
    const isTempProject = currentProject.id.startsWith('temp-project-');
    if (isTempProject && !customName) {
      // Show dialog to ask for project name
      setNewProjectName(currentProject.name);
      setNewProjectDescription(currentProject.description || '');
      setNameDialogOpen(true);
      return;
    }

    if (isSaving) {
      console.log('Save already in progress');
      return;
    }

    try {
      setIsSaving(true);
      setSaveState({ status: 'saving', lastSaved: null, error: null });

      // Check authentication
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('Not authenticated. Please log in again.');
      }

      // Check if this is a temporary project (starts with "temp-project-")
      const isTempProject = currentProject.id.startsWith('temp-project-');

      let projectId = currentProject.id;

      if (isTempProject) {
        console.log(
          'Temporary project detected, creating new project in database...'
        );

        // Check project limit before creating
        const { data: limitCheck, error: limitError } = await supabase
          .rpc('check_project_limit', { p_user_id: user.id })
          .single();

        if (limitError) {
          console.error('Error checking project limit:', limitError);
        }

        const limitData = limitCheck as any;

        if (limitData && !limitData.can_create_project) {
          throw new Error(
            `You've reached your plan limit of ${limitData.max_allowed} projects. Please upgrade to Pro for unlimited projects.`
          );
        }

        // Use custom name and description if provided, otherwise use current project values
        const finalName = customName || currentProject.name;
        const finalDescription =
          customDescription || currentProject.description;

        // Create a new project in the database
        const { data: newProject, error: createError } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            name: finalName,
            description: finalDescription,
            slug:
              finalName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '') + `-${Date.now()}`,
            status: 'draft',
            element_count: elements.length,
            seo_settings: currentProject.seo_settings || {},
          })
          .select()
          .single();

        if (createError) {
          throw new Error(`Failed to create project: ${createError.message}`);
        }

        projectId = newProject.id;
        console.log('New project created:', projectId);

        // Update elements to reference the new project ID
        elements.forEach((el) => {
          el.project_id = projectId;
        });
      }

      console.log('Starting manual save...', {
        projectId: projectId,
        userId: user.id,
        elements: elements.length,
        elementTypes: elements.map((el) => el.type),
        isNewProject: isTempProject,
      });

      // Validate elements before saving
      if (!Array.isArray(elements)) {
        throw new Error('Elements is not an array');
      }

      // Deduplicate elements by ID
      const uniqueElements = elements.reduce(
        (acc, el) => {
          if (!el || !el.id) {
            console.error('Invalid element found:', el);
            return acc;
          }
          const exists = acc.find((item) => item.id === el.id);
          if (!exists) {
            acc.push(el);
          } else {
            console.warn(
              'Duplicate element prevented during save:',
              el.id,
              el.type
            );
          }
          return acc;
        },
        [] as typeof elements
      );

      console.log('After deduplication:', {
        unique: uniqueElements.length,
        original: elements.length,
        uniqueTypes: uniqueElements.map((el) => el.type),
      });

      // Verify user owns the project (skip for new temp projects)
      if (!isTempProject && currentProject.user_id !== user.id) {
        throw new Error('You do not have permission to edit this project');
      }

      console.log('Deleting existing elements...');

      // Delete all existing elements
      const { error: deleteError, count } = await supabase
        .from('elements')
        .delete({ count: 'exact' })
        .eq('project_id', projectId);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw new Error(
          `Failed to delete elements: ${deleteError.message || JSON.stringify(deleteError)}`
        );
      }

      console.log('Deleted elements:', count);

      // Insert deduplicated elements
      if (uniqueElements.length > 0) {
        const elementsToInsert = uniqueElements.map((el) => ({
          id: el.id,
          project_id: el.project_id,
          type: el.type,
          order: el.order,
          props: el.props,
          version: el.version,
          created_at: el.created_at,
          updated_at: new Date().toISOString(),
        }));

        console.log(
          'Inserting elements:',
          elementsToInsert.length,
          elementsToInsert
        );

        const { error: insertError, data: insertedData } = await supabase
          .from('elements')
          .insert(elementsToInsert)
          .select();

        if (insertError) {
          console.error('Insert error:', insertError);
          throw new Error(
            `Failed to insert elements: ${insertError.message || JSON.stringify(insertError)}`
          );
        }

        console.log(
          'Successfully inserted:',
          insertedData?.length || 0,
          'elements'
        );
      } else {
        console.log('No elements to insert');
      }

      // Update project
      console.log('Updating project metadata...');
      const { error: projectError, data: updatedProject } = await supabase
        .from('projects')
        .update({
          element_count: uniqueElements.length,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .select();

      if (projectError) {
        console.error('Project update error:', projectError);
        throw new Error(
          `Failed to update project: ${projectError.message || JSON.stringify(projectError)}`
        );
      }

      console.log('Project updated:', updatedProject);

      // Create version snapshot
      console.log('Creating version snapshot...');
      try {
        const versionResponse = await fetch(
          `/api/projects/${projectId}/versions`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              label: null, // Auto-generated label
              is_auto_save: false, // Manual save
            }),
          }
        );

        if (!versionResponse.ok) {
          console.warn(
            'Failed to create version snapshot:',
            await versionResponse.text()
          );
        } else {
          const versionData = await versionResponse.json();
          console.log('Version snapshot created:', versionData);
        }
      } catch (versionError) {
        console.warn('Error creating version snapshot:', versionError);
        // Don't fail the save if version creation fails
      }

      setSaveState({
        status: 'saved',
        lastSaved: new Date(),
        error: null,
      });
      console.log('Save completed successfully!');

      // If this was a temporary project, redirect to the actual project edit page
      if (isTempProject) {
        console.log('Redirecting to project edit page...');
        window.location.href = `/projects/${projectId}/edit`;
      }
    } catch (error) {
      console.error('Save failed with error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
        error: error,
      });

      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);

      setSaveState({
        status: 'error',
        lastSaved: null,
        error: errorMessage,
      });

      alert('Failed to save: ' + errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Open preview page in new tab
    const previewUrl = isGuestMode
      ? '/builder/preview'
      : `/projects/${projectId || currentProject?.id}/preview`;
    window.open(previewUrl, '_blank');
  };

  const handlePublish = () => {
    if (isGuestMode) {
      alert('Sign up to publish your page!');
      return;
    }
    setPublishDialogOpen(true);
  };

  const handleRepublish = async () => {
    if (isGuestMode || !currentProject) return;

    setIsRepublishing(true);
    try {
      // Get CSRF token
      const csrfResponse = await fetch('/api/csrf');
      const csrfData = await csrfResponse.json();

      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfData.token,
        },
        body: JSON.stringify({ projectId: currentProject.id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Page republished successfully!');
      } else {
        throw new Error(data.error || 'Failed to republish');
      }
    } catch (error) {
      console.error('Republish error:', error);
      alert(
        'Failed to republish: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    } finally {
      setIsRepublishing(false);
    }
  };

  const handleSaveSEO = async (settings: any) => {
    if (!currentProject) return;

    const response = await fetch(`/api/projects/${currentProject.id}/seo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seo_settings: settings }),
    });

    if (!response.ok) {
      throw new Error('Failed to save SEO settings');
    }

    // Trigger a manual save to update the project
    handleSave();
  };

  const getSaveStatusColor = () => {
    switch (saveState.status) {
      case 'saved':
        return 'text-green-600';
      case 'saving':
        return 'text-blue-600';
      case 'unsaved':
        return 'text-orange-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSaveStatusText = () => {
    switch (saveState.status) {
      case 'saved':
        return saveState.lastSaved
          ? `Saved at ${saveState.lastSaved.toLocaleTimeString()}`
          : 'Saved';
      case 'saving':
        return 'Saving...';
      case 'unsaved':
        return 'Click Save to save changes';
      case 'error':
        return 'Save failed - try again';
      default:
        return 'Ready';
    }
  };

  // Handle template import
  const handleImportTemplate = async (data: ImportedProjectData) => {
    if (!currentProject) return;

    // Create new elements with proper IDs and project reference
    const newElements = data.elements.map((el, index) => ({
      id: crypto.randomUUID(),
      project_id: currentProject.id,
      type: el.type as any,
      order: index,
      props: el.props,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Update the project with imported SEO settings if available
    const updatedProject = {
      ...currentProject,
      name: data.project.name || currentProject.name,
      description: data.project.description || currentProject.description,
      seo_settings: data.project.seo_settings || currentProject.seo_settings,
      element_count: newElements.length,
    };

    // Load the imported project data into state
    loadProject({
      project: updatedProject,
      elements: newElements,
    });

    // Mark as unsaved so user can save the imported content
    setSaveState({
      status: 'unsaved',
      lastSaved: null,
      error: null,
    });
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left section - Project info */}
      <div className="flex items-center gap-2 md:gap-4">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>

        {/* Mobile sidebar toggles */}
        <div className="flex items-center gap-1 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            title="Toggle Elements"
          >
            <PanelLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            title="Toggle Properties"
          >
            <PanelRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-gray-900">
            {projectName || currentProject?.name || 'Untitled Project'}
          </h1>
          <p className={`text-xs ${getSaveStatusColor()}`}>
            {isGuestMode ? 'Guest Mode - Not Saved' : getSaveStatusText()}
          </p>
        </div>
      </div>

      {/* Center section - Editor controls */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => undo()}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => redo()}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewportMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewportMode('desktop')}
            title="Desktop view"
            className="px-3"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={viewportMode === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewportMode('tablet')}
            title="Tablet view"
            className="px-3"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={viewportMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewportMode('mobile')}
            title="Mobile view"
            className="px-3"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right section - Action buttons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handlePreview}>
          <Eye className="w-4 h-4 mr-2" />
          <span className="hidden md:inline">Preview</span>
        </Button>

        {/* Republish button - only shown for published projects */}
        {!isGuestMode &&
          (projectStatus || currentProject?.status) === 'published' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRepublish}
              disabled={isRepublishing}
              title="Republish page with latest changes"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRepublishing ? 'animate-spin' : ''}`}
              />
              <span className="hidden md:inline">
                {isRepublishing ? 'Republishing...' : 'Republish'}
              </span>
            </Button>
          )}

        {/* More menu - Analytics, Forms, Settings */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen(!menuOpen)}
            onBlur={() => setTimeout(() => setMenuOpen(false), 200)}
          >
            <Settings className="w-4 h-4 mr-1" />
            <span className="hidden md:inline">More</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[60]">
              <button
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 w-full text-left"
                onClick={() => {
                  setMenuOpen(false);
                  setSeoDialogOpen(true);
                }}
              >
                <Search className="w-4 h-4" />
                SEO Settings
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 w-full text-left"
                onClick={() => {
                  setMenuOpen(false);
                  setTrackingPixelsDialogOpen(true);
                }}
              >
                <BarChart3 className="w-4 h-4" />
                Tracking Pixels
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 w-full text-left"
                onClick={() => {
                  setMenuOpen(false);
                  setProjectSettingsOpen(true);
                }}
              >
                <Settings className="w-4 h-4" />
                Project Settings
              </button>
            </div>
          )}
        </div>

        {!isGuestMode && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setVersionHistoryOpen(true)}
            title="Version History"
          >
            <Clock className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">History</span>
          </Button>
        )}
        {!isGuestMode && (
          <Button
            size="sm"
            onClick={() => handleSave()}
            className="hidden md:flex"
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        )}
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={handlePublish}
        >
          {isGuestMode
            ? 'Sign Up to Publish'
            : (projectStatus || currentProject?.status) === 'published'
              ? 'Update'
              : 'Publish'}
        </Button>
      </div>

      {/* Publish Dialog */}
      {currentProject && !isGuestMode && (
        <PublishDialog
          open={publishDialogOpen}
          onOpenChange={setPublishDialogOpen}
          projectId={currentProject.id}
          projectName={currentProject.name}
          currentPublishedUrl={currentProject.published_url}
          subscriptionPlan={profile?.subscription_plan}
          userSubdomain={profile?.subdomain}
          autoPublish={
            (projectStatus || currentProject?.status) === 'published'
          }
        />
      )}

      {/* SEO Settings Dialog */}
      {currentProject && !isGuestMode && (
        <SEOSettingsDialog
          open={seoDialogOpen}
          onOpenChange={setSeoDialogOpen}
          projectId={currentProject.id}
          currentSettings={currentProject.seo_settings}
          onSave={handleSaveSEO}
        />
      )}

      {/* Tracking Pixels Dialog */}
      {currentProject && !isGuestMode && (
        <ProjectTrackingPixelsDialog
          open={trackingPixelsDialogOpen}
          onOpenChange={setTrackingPixelsDialogOpen}
          projectId={currentProject.id}
        />
      )}

      {/* Version History Sidebar */}
      {currentProject && !isGuestMode && (
        <VersionHistorySidebar
          projectId={currentProject.id}
          open={versionHistoryOpen}
          onClose={() => setVersionHistoryOpen(false)}
        />
      )}

      {/* Project Settings Dialog (Import/Export) */}
      {currentProject && !isGuestMode && (
        <ProjectSettingsDialog
          open={projectSettingsOpen}
          onOpenChange={setProjectSettingsOpen}
          onImport={handleImportTemplate}
        />
      )}

      {/* Project Name Dialog (for temporary projects) */}
      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Your Project</DialogTitle>
            <DialogDescription>
              Give your project a name before saving it to your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name *</Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="My Awesome Landing Page"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">
                Description (Optional)
              </Label>
              <Input
                id="project-description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="A brief description of your project"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNameDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!newProjectName.trim()) {
                  alert('Please enter a project name');
                  return;
                }
                setNameDialogOpen(false);
                handleSave(newProjectName.trim(), newProjectDescription.trim());
              }}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
