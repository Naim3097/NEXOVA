'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Clock,
  RotateCcw,
  Tag,
  Save,
  Trash2,
  X,
  Plus,
  Check,
  Edit2,
} from 'lucide-react';

interface Version {
  id: string;
  version_number: number;
  snapshot_type: string;
  is_auto_save: boolean;
  label: string | null;
  created_at: string;
}

interface VersionHistorySidebarProps {
  projectId: string;
  open: boolean;
  onClose: () => void;
  onRestore?: () => void;
}

export function VersionHistorySidebar({
  projectId,
  open,
  onClose,
  onRestore,
}: VersionHistorySidebarProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [labelValue, setLabelValue] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (open) {
      fetchVersions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, projectId]); // fetchVersions recreated on every render, safe to omit

  const fetchVersions = async () => {
    try {
      console.log('Fetching versions for project:', projectId);
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/versions`);
      const data = await response.json();

      console.log('Fetch versions response:', {
        ok: response.ok,
        status: response.status,
        versionsCount: data.versions?.length || 0,
        versions: data.versions
      });

      if (response.ok) {
        setVersions(data.versions || []);
        console.log('Updated versions state with', data.versions?.length || 0, 'versions');
      } else {
        console.error('Failed to fetch versions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnapshot = async () => {
    try {
      setCreating(true);
      const response = await fetch(`/api/projects/${projectId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: `Manual snapshot ${new Date().toLocaleString()}`,
          is_auto_save: false,
        }),
      });

      if (response.ok) {
        await fetchVersions();
      } else {
        const data = await response.json();
        alert(`Failed to create snapshot: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating snapshot:', error);
      alert('Failed to create snapshot');
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (versionId: string, versionNumber: number) => {
    if (
      !confirm(
        `Are you sure you want to restore to version ${versionNumber}? This will replace your current work.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/versions/${versionId}/restore`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        alert('Version restored successfully! Reloading page...');
        if (onRestore) onRestore();
        window.location.reload();
      } else {
        const data = await response.json();
        alert(`Failed to restore version: ${data.error}`);
      }
    } catch (error) {
      console.error('Error restoring version:', error);
      alert('Failed to restore version');
    }
  };

  const handleUpdateLabel = async (versionId: string) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/versions/${versionId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ label: labelValue }),
        }
      );

      if (response.ok) {
        await fetchVersions();
        setEditingLabel(null);
        setLabelValue('');
      } else {
        const data = await response.json();
        alert(`Failed to update label: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating label:', error);
      alert('Failed to update label');
    }
  };

  const handleDeleteVersion = async (versionId: string, versionNumber: number) => {
    console.log('Delete clicked for version:', versionNumber, versionId);

    if (!confirm(`Are you sure you want to delete version ${versionNumber}?`)) {
      console.log('Delete cancelled by user');
      return;
    }

    console.log('Attempting to delete version...');

    try {
      const response = await fetch(
        `/api/projects/${projectId}/versions/${versionId}`,
        {
          method: 'DELETE',
        }
      );

      console.log('Delete response:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Version deleted successfully:', data);
        await fetchVersions();
        alert('Version deleted successfully');
      } else {
        const data = await response.json();
        console.error('Delete failed:', data);
        alert(`Failed to delete version: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting version:', error);
      alert('Failed to delete version: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (!open) return null;

  return (
    <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-white border-l border-gray-200 shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold">Version History</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Create Snapshot Button */}
      <div className="p-4 border-b">
        <Button
          onClick={handleCreateSnapshot}
          disabled={creating}
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {creating ? 'Creating...' : 'Create Snapshot'}
        </Button>
      </div>

      {/* Version List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 text-center text-gray-500">
            Loading versions...
          </div>
        )}

        {!loading && versions.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No versions yet. Create your first snapshot!
          </div>
        )}

        {!loading && versions.map((version) => (
          <div
            key={version.id}
            className="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                {/* Version Number */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">
                    Version {version.version_number}
                  </span>
                  {version.is_auto_save && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      Auto
                    </span>
                  )}
                </div>

                {/* Label */}
                {editingLabel === version.id ? (
                  <div className="flex gap-1 mb-2">
                    <Input
                      value={labelValue}
                      onChange={(e) => setLabelValue(e.target.value)}
                      placeholder="Add label..."
                      className="h-7 text-xs"
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateLabel(version.id);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUpdateLabel(version.id)}
                      className="h-7 px-2"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingLabel(null);
                        setLabelValue('');
                      }}
                      className="h-7 px-2"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : version.label ? (
                  <div className="flex items-center gap-1 mb-2">
                    <Tag className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{version.label}</span>
                  </div>
                ) : null}

                {/* Timestamp */}
                <p className="text-xs text-gray-400">
                  {formatDate(version.created_at)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRestore(version.id, version.version_number)}
                className="flex-1 h-7 text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Restore
              </Button>

              {!version.label && !editingLabel && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingLabel(version.id);
                    setLabelValue(version.label || '');
                  }}
                  className="h-7 px-2"
                  title="Add label"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              )}

              {version.version_number !== 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteVersion(version.id, version.version_number)}
                  className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Delete version"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t bg-gray-50">
        <p className="text-xs text-gray-500">
          {versions.length} version{versions.length !== 1 ? 's' : ''} saved
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Auto-saves every 15 minutes
        </p>
      </div>
    </div>
  );
}
