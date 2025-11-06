'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Job Request Tracker
              </span>
            </Link>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                All Requests
              </Link>
              <Link
                href="/new"
                className="flex items-center space-x-1 bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                <span>New Request</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </div>
    </header>
  );
}