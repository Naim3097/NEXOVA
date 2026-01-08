'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Trash2, ArrowLeft, RefreshCw, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/auth-client';

interface FormSubmission {
  id: string;
  form_id: string;
  project_id: string;
  data: Record<string, any>;
  submitted_at: string;
  ip_address: string;
  user_agent: string;
}

export default function FormSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const projectId = params.projectId as string;

  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState<string>('all');
  const [exporting, setExporting] = useState(false);
  const [projectName, setProjectName] = useState<string>('');

  // Fetch project name
  useEffect(() => {
    const fetchProjectName = async () => {
      const { data } = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single();

      if (data) {
        setProjectName(data.name);
      }
    };

    fetchProjectName();
  }, [projectId, supabase]);

  // Fetch submissions
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/forms/submissions', window.location.origin);
      url.searchParams.append('projectId', projectId);
      if (selectedFormId !== 'all') {
        url.searchParams.append('formId', selectedFormId);
      }

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.submissions);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch submissions',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [projectId, selectedFormId]);

  // Export to CSV
  const handleExport = async () => {
    setExporting(true);
    try {
      const url = new URL('/api/forms/export', window.location.origin);
      url.searchParams.append('projectId', projectId);
      if (selectedFormId !== 'all') {
        url.searchParams.append('formId', selectedFormId);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `form-submissions-${projectId}-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: 'Success',
        description: 'Submissions exported successfully',
      });
    } catch (error) {
      console.error('Error exporting:', error);
      toast({
        title: 'Error',
        description: 'Failed to export submissions',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  // Delete submission
  const handleDelete = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      const response = await fetch('/api/forms/submissions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Submission deleted successfully',
        });
        fetchSubmissions();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete submission',
        variant: 'destructive',
      });
    }
  };

  // Get unique form IDs
  const uniqueFormIds = Array.from(new Set(submissions.map(s => s.form_id)));

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get all unique field names from submissions
  const getAllFieldNames = () => {
    const fields = new Set<string>();
    submissions.forEach(submission => {
      Object.keys(submission.data || {}).forEach(key => fields.add(key));
    });
    return Array.from(fields);
  };

  const fieldNames = getAllFieldNames();

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Form Submissions</h1>
            <p className="text-muted-foreground mt-1">
              {projectName && `Project: ${projectName}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSubmissions}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting || submissions.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{submissions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Forms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{uniqueFormIds.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Latest Submission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {submissions.length > 0
                ? new Date(submissions[0].submitted_at).toLocaleDateString()
                : 'No submissions'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      {uniqueFormIds.length > 1 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Filter by Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedFormId} onValueChange={setSelectedFormId}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                {uniqueFormIds.map(formId => (
                  <SelectItem key={formId} value={formId}>
                    Form: {formId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            View and manage form submissions for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Inbox className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground text-sm">
                Form submissions will appear here once users start submitting forms.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Form ID</TableHead>
                    {fieldNames.map(field => (
                      <TableHead key={field}>{field}</TableHead>
                    ))}
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {formatDate(submission.submitted_at)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {submission.form_id}
                        </Badge>
                      </TableCell>
                      {fieldNames.map(field => (
                        <TableCell key={field}>
                          {submission.data?.[field] || '-'}
                        </TableCell>
                      ))}
                      <TableCell className="font-mono text-xs">
                        {submission.ip_address}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(submission.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
