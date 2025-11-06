import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase/server';

// GET all job requests
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseServer
      .from('job_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching job requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job requests' },
      { status: 500 }
    );
  }
}

// POST create new job request
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Get member ID from Clerk user ID
    const { data: member } = await supabaseServer
      .from('members')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    const { data, error } = await supabaseServer
      .from('job_requests')
      .insert({
        ...body,
        created_by: member?.id || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating job request:', error);
    return NextResponse.json(
      { error: 'Failed to create job request' },
      { status: 500 }
    );
  }
}