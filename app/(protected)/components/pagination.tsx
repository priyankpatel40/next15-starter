'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Pagination({
  totalPages,
  page,
  itemsPerPage,
  totalCount,
}: {
  totalPages: number;
  page: number;
  itemsPerPage: number;
  totalCount: number;
}) {
  const pageNumbers = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 4); i += 1) {
    pageNumbers.push(i);
  }
  return (
    <div className="border-t border-gray-200 p-4 dark:border-gray-700">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium">{Math.min(page * itemsPerPage, totalCount)}</span>{' '}
          of <span className="font-medium">{totalCount}</span> results
        </p>
        <nav className="isolate inline-flex rounded-md shadow-sm" aria-label="Pagination">
          <Link href={`?page=${Math.max(page - 1, 1)}`} passHref>
            <Button
              disabled={page === 1}
              className="relative inline-flex items-center rounded-l-md bg-white p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="size-5" aria-hidden="true" />
            </Button>
          </Link>
          {pageNumbers.map((num) => (
            <Link key={num} href={`?page=${num}`} passHref>
              <Button
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                  num === page
                    ? 'z-10 bg-customGray-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customGray-600'
                    : 'bg-white text-gray-500 hover:bg-gray-50 focus:z-20'
                }`}
              >
                {num}
              </Button>
            </Link>
          ))}
          <Link href={`?page=${Math.min(page + 1, totalPages)}`} passHref>
            <Button
              disabled={page === totalPages}
              className="relative inline-flex items-center rounded-r-md bg-white p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="size-5" aria-hidden="true" />
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  );
}
