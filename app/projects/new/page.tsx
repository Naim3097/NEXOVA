'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/auth-client';
import { useAuth } from '@/contexts/AuthContext';

function NewProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<any>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectLimit, setProjectLimit] = useState<any>(null);
  const [limitReached, setLimitReached] = useState(false);

  const templateSlug = searchParams.get('template');

  useEffect(() => {
    if (templateSlug) {
      fetchTemplate(templateSlug);
    }
    if (user) {
      checkProjectLimit();
    }
  }, [templateSlug, user]);

  const checkProjectLimit = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .rpc('check_project_limit', { p_user_id: user.id })
        .single();

      if (error) {
        console.error('Error checking project limit:', error);
        return;
      }

      const limitData = data as any;
      setProjectLimit(limitData);

      if (limitData && !limitData.can_create_project) {
        setLimitReached(true);
        setError(
          `You've reached your plan limit of ${limitData.max_allowed} projects. Upgrade to Pro for unlimited projects.`
        );
      }
    } catch (err) {
      console.error('Error checking project limit:', err);
    }
  };

  const fetchTemplate = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      setTemplate(data);
      setProjectName(`My ${data.name}`);
      setProjectDescription(data.description || '');
    } catch (err) {
      console.error('Error fetching template:', err);
      setError('Failed to load template');
    }
  };

  const createProductsFromTemplate = async (
    projectId: string,
    template: any
  ) => {
    try {
      // Find pricing element in template
      const pricingElement = template.data?.elements?.find(
        (el: any) => el.type === 'pricing'
      );

      if (!pricingElement || !pricingElement.props?.plans) {
        console.log('No pricing data found in template');
        return;
      }

      // Create products from pricing plans
      const products = pricingElement.props.plans.map((plan: any) => ({
        user_id: user?.id,
        code: `${plan.name.replace(/\s+/g, '-').toUpperCase()}-${Date.now()}`,
        name: plan.name,
        description: plan.description || '',
        stock: 999, // Unlimited for digital products
        base_price: parseFloat(plan.price) || 0,
        currency: plan.currency || 'RM',
        quantity_pricing: [],
        notes: `Auto-created from ${template.name} template`,
        status: 'active',
        source_project_id: projectId,
        source_template: template.name,
        is_template_product: true,
      }));

      const { data: createdProducts, error } = await supabase
        .from('products')
        .insert(products)
        .select();

      if (error) {
        console.error('Error creating products from template:', error);
        return;
      }

      console.log(
        `Created ${createdProducts?.length || 0} products from template`
      );

      // Update the pricing element to reference the created product IDs
      if (createdProducts && createdProducts.length > 0) {
        const { error: updateError } = await supabase
          .from('elements')
          .update({
            props: {
              ...pricingElement.props,
              plans: pricingElement.props.plans.map(
                (plan: any, index: number) => ({
                  ...plan,
                  product_id: createdProducts[index]?.id || null,
                })
              ),
            },
          })
          .eq('project_id', projectId)
          .eq('type', 'pricing');

        if (updateError) {
          console.error(
            'Error linking products to pricing element:',
            updateError
          );
        }
      }
    } catch (err) {
      console.error('Error in createProductsFromTemplate:', err);
      // Don't throw - product creation is optional
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !template) return;

    // Check project limit before creating
    if (limitReached || (projectLimit && !projectLimit.can_create_project)) {
      setError(
        `You've reached your plan limit of ${projectLimit.max_allowed} projects. Upgrade to Pro for unlimited projects.`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Double-check project limit server-side
      const { data: limitCheck } = await supabase
        .rpc('check_project_limit', { p_user_id: user.id })
        .single();

      const limitData = limitCheck as any;

      if (limitData && !limitData.can_create_project) {
        setError(
          `You've reached your plan limit of ${limitData.max_allowed} projects. Please upgrade to Pro for unlimited projects.`
        );
        setLoading(false);
        setLimitReached(true);
        return;
      }

      // Generate slug with deduplication
      let slug = projectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);

      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existingProject) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
      }

      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: projectName,
          description: projectDescription,
          slug,
          status: 'draft',
          element_count: template.data?.elements?.length || 0,
          seo_settings: template.data?.seo_settings || {},
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create elements from template
      if (template.data?.elements && template.data.elements.length > 0) {
        const elements = template.data.elements.map((element: any) => ({
          project_id: project.id,
          type: element.type,
          order: element.order,
          props: element.props || {},
          version: 1,
        }));

        const { error: elementsError } = await supabase
          .from('elements')
          .insert(elements);

        if (elementsError) throw elementsError;
      }

      // Auto-create products from template pricing data
      await createProductsFromTemplate(project.id, template);

      // Update template usage count
      await supabase
        .from('templates')
        .update({ usage_count: (template.usage_count || 0) + 1 })
        .eq('id', template.id);

      // Redirect to project editor (placeholder for now)
      router.push(`/projects/${project.id}/edit`);
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (!templateSlug) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Card className="max-w-md rounded-2xl border-[#E2E8F0]">
          <CardHeader>
            <CardTitle className="text-[#455263]">
              No Template Selected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#969696] mb-4">
              Please select a template from the gallery to create a new project.
            </p>
            <Button variant="teal" onClick={() => router.push('/templates')}>
              Browse Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!template && !error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5FC7CD]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="rounded-2xl border-[#E2E8F0]">
          <CardHeader>
            <CardTitle className="text-[#455263]">Create New Project</CardTitle>
            {template && (
              <p className="text-sm text-[#969696]">
                Using template: {template.name}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="mb-4 p-4 bg-[#EF4444]/10 text-[#EF4444] rounded-xl">
                <p className="mb-3">{error}</p>
                {limitReached && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/dashboard')}
                    >
                      Back to Dashboard
                    </Button>
                    <Button
                      type="button"
                      variant="teal"
                      size="sm"
                      onClick={() => router.push('/pricing')}
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                )}
              </div>
            ) : null}

            <form onSubmit={createProject} className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Awesome Landing Page"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  type="text"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="A brief description of your project"
                />
              </div>

              {template && (
                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <h4 className="font-semibold mb-2 text-[#455263]">
                    Template Preview
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-[#969696]">Industry:</span>{' '}
                      {template.industry}
                    </p>
                    <p>
                      <span className="text-[#969696]">Sections:</span>{' '}
                      {template.data?.elements?.length || 0}
                    </p>
                    <p>
                      <span className="text-[#969696]">Includes:</span>{' '}
                      {template.data?.elements
                        ?.map((e: any) => e.type)
                        .join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="teal"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5FC7CD]"></div>
          </div>
        }
      >
        <NewProjectForm />
      </Suspense>
    </ProtectedRoute>
  );
}
