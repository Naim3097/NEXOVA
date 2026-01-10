'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/auth-client';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import type { Project } from '@/types';

function DashboardContent() {
  const { user, profile, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(projectId);

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user?.id); // Ensure user can only delete their own projects

      if (error) throw error;

      // Remove from local state
      setProjects((prev) => prev.filter((p) => p.id !== projectId));

      // Show success message
      alert('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Name:</strong> {profile?.display_name || 'Not set'}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Plan:</strong>{' '}
                  <span className="capitalize">
                    {profile?.subscription_plan || 'free'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get started by choosing a professionally designed template for
                your landing page.
              </p>
              <Link href="/templates">
                <Button className="w-full">Browse Templates</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading projects...</p>
              ) : projects.length === 0 ? (
                <p className="text-muted-foreground">
                  You don&apos;t have any projects yet. Create your first landing
                  page by selecting a template!
                </p>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            Status:{' '}
                            <span
                              className={
                                project.status === 'published'
                                  ? 'text-green-600 font-medium'
                                  : 'text-gray-600'
                              }
                            >
                              {project.status}
                            </span>
                          </span>
                          <span className="text-xs text-gray-500">
                            Updated:{' '}
                            {new Date(project.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.published_url && (
                          <Link
                            href={project.published_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        )}
                        <Link href={`/projects/${project.id}/edit`}>
                          <Button size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          disabled={deletingId === project.id}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {deletingId === project.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/products">
                  <Button variant="outline" className="w-full">
                    Manage Products
                  </Button>
                </Link>
                <Link href="/dashboard/transactions">
                  <Button variant="outline" className="w-full">
                    View Transactions
                  </Button>
                </Link>
                <Link href="/dashboard/settings/payments">
                  <Button variant="outline" className="w-full">
                    Payment Settings
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Note: Analytics and Forms are available per project in the editor
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
