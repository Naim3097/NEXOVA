import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const formId = searchParams.get('formId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 403 }
      );
    }

    // Fetch submissions
    let query = supabase
      .from('form_submissions')
      .select('*')
      .eq('project_id', projectId)
      .order('submitted_at', { ascending: false });

    if (formId) {
      query = query.eq('form_id', formId);
    }

    const { data: submissions, error } = await query;

    if (error) {
      console.error('Error fetching submissions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    if (!submissions || submissions.length === 0) {
      return NextResponse.json(
        { error: 'No submissions found' },
        { status: 404 }
      );
    }

    // Generate CSV
    const csv = generateCSV(submissions);

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="form-submissions-${projectId}-${Date.now()}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export submissions' },
      { status: 500 }
    );
  }
}

function generateCSV(submissions: any[]): string {
  if (submissions.length === 0) return '';

  // Collect all unique field names from all submissions
  const allFields = new Set<string>();
  submissions.forEach(submission => {
    if (submission.data && typeof submission.data === 'object') {
      Object.keys(submission.data).forEach(key => allFields.add(key));
    }
  });

  // Define column headers
  const headers = [
    'Submission ID',
    'Form ID',
    'Submitted At',
    'IP Address',
    ...Array.from(allFields),
  ];

  // Generate CSV rows
  const rows = submissions.map(submission => {
    const row = [
      escapeCSV(submission.id),
      escapeCSV(submission.form_id),
      escapeCSV(new Date(submission.submitted_at).toLocaleString()),
      escapeCSV(submission.ip_address || 'N/A'),
    ];

    // Add form field data
    allFields.forEach(field => {
      const value = submission.data?.[field] || '';
      row.push(escapeCSV(value));
    });

    return row.join(',');
  });

  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
}

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';

  const stringValue = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}
