'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/auth-client';
import {
  ExternalLink,
  Edit,
  Trash2,
  Crown,
  ArrowUpCircle,
  Shield,
  Plus,
  FileText,
  Globe,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { UpgradePlanModal } from '@/components/dashboard/UpgradePlanModal';
import { HelpButton } from '@/components/dashboard/HelpButton';
import { isAdminEmail } from '@/lib/admin';
import type { Project } from '@/types';

function DashboardContent() {
  const { user, profile, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const currentPlan = profile?.subscription_plan || 'free';
  const isPremiumOrHigher =
    currentPlan === 'premium' || currentPlan === 'enterprise';
  const isAdmin = user?.email ? isAdminEmail(user.email) : false;

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

  const handleDeleteProject = async (
    projectId: string,
    projectName: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(projectId);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete project');
      }

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      alert('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Count stats
  const totalViews = projects.reduce(
    (sum, p) => sum + ((p as any).view_count || 0),
    0
  );
  const maxProjects =
    currentPlan === 'enterprise'
      ? 'Unlimited'
      : currentPlan === 'premium'
        ? 20
        : 5;

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="px-6 lg:px-8 pt-8 pb-2 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#455263] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[#969696] mt-1">
            Manage your websites and creative projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <HelpButton pageSource="dashboard" />
          {isAdmin && (
            <Link href="/dashboard/admin">
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-1" />
                Admin
              </Button>
            </Link>
          )}
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>

      <main className="px-6 lg:px-8 py-6">
        <div className="grid gap-6">
          {/* Welcome Card with Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#455263]">
                Welcome back, {profile?.display_name || 'there'}!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-3">
                  <p className="text-xs text-[#969696]">Current Plan</p>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={isPremiumOrHigher ? 'default' : 'teal'}
                      className={
                        currentPlan === 'premium'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : currentPlan === 'enterprise'
                            ? 'bg-purple-500'
                            : ''
                      }
                    >
                      {currentPlan === 'premium' && (
                        <Crown className="h-3 w-3 mr-1" />
                      )}
                      <span className="capitalize">{currentPlan} Tier</span>
                    </Badge>
                    {currentPlan !== 'enterprise' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-[#5FC7CD] border-[#5FC7CD] hover:bg-[#5FC7CD]/10 h-7 px-3"
                        onClick={() => setShowUpgradeModal(true)}
                      >
                        <ArrowUpCircle className="h-3 w-3 mr-1" />
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
                <div className="border border-[#E2E8F0] rounded-xl p-4">
                  <p className="text-xs text-[#969696] mb-1">Active Projects</p>
                  <p className="text-xl font-bold text-[#5FC7CD]">
                    {projects.length} / {maxProjects}
                  </p>
                </div>
                <div className="border border-[#E2E8F0] rounded-xl p-4">
                  <p className="text-xs text-[#969696] mb-1">Total Views</p>
                  <p className="text-xl font-bold text-[#5FC7CD]">
                    {totalViews.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <UpgradePlanModal
            open={showUpgradeModal}
            onOpenChange={setShowUpgradeModal}
          />

          {/* CTA + Quick Actions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Create New Project CTA */}
            <div
              data-tour="create-project"
              className="lg:col-span-3 rounded-2xl bg-gradient-to-r from-[#8273B5] to-[#5FC7CD] p-8 text-white"
            >
              <h2 className="text-xl font-bold mb-2">Create New Project</h2>
              <p className="text-sm text-white/80 mb-6">
                Start from scratch or choose a professionally designed template.
              </p>
              <Link href="/templates">
                <Button
                  variant="teal"
                  className="bg-white/20 hover:bg-white/30 border border-white/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Site
                </Button>
              </Link>
            </div>

            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-[#455263]">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/templates"
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5FC7CD]/10">
                      <FileText className="h-4 w-4 text-[#5FC7CD]" />
                    </div>
                    <span className="text-sm font-medium text-[#455263]">
                      Browse Templates
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#969696] group-hover:text-[#5FC7CD] transition-colors" />
                </Link>
                <Link
                  href="/dashboard/settings/subdomain"
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8273B5]/10">
                      <Globe className="h-4 w-4 text-[#8273B5]" />
                    </div>
                    <span className="text-sm font-medium text-[#455263]">
                      Import Domain
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#969696] group-hover:text-[#5FC7CD] transition-colors" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <Card data-tour="projects-list">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#455263]">Recent Projects</CardTitle>
              {projects.length > 0 && (
                <Link
                  href="/dashboard"
                  className="text-sm text-[#5FC7CD] hover:underline font-medium"
                >
                  View All
                </Link>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-[#969696]">Loading projects...</p>
              ) : projects.length === 0 ? (
                <p className="text-[#969696]">
                  You don&apos;t have any projects yet. Create your first
                  landing page by selecting a template!
                </p>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => {
                    const initial = project.name.charAt(0).toUpperCase();
                    const isPublished = project.status === 'published';
                    const updatedAt = new Date(project.updated_at);
                    const now = new Date();
                    const diffMs = now.getTime() - updatedAt.getTime();
                    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                    const timeAgo =
                      diffHrs < 1
                        ? 'Just now'
                        : diffHrs < 24
                          ? `Last edited ${diffHrs} hours ago`
                          : `Last edited ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

                    return (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-[#F8FAFC] transition-all"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5FC7CD] text-white font-bold text-sm flex-shrink-0">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-[#455263] truncate">
                              {project.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-0.5">
                              <Badge
                                variant={isPublished ? 'success' : 'secondary'}
                                className="text-xs"
                              >
                                {isPublished ? 'Published' : 'Draft'}
                              </Badge>
                              <span className="text-xs text-[#969696]">
                                {timeAgo}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {project.published_url && (
                            <Link
                              href={project.published_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-[#969696] hover:text-[#5FC7CD]"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/projects/${project.id}/edit`}>
                            <Button variant="teal" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit Site
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#969696] hover:text-[#EF4444]"
                            onClick={() =>
                              handleDeleteProject(project.id, project.name)
                            }
                            disabled={deletingId === project.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
