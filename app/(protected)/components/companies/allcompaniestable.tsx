'use client';

import { EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';
import { CalendarIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Avatar from '@/components/ui/avatar';
import { calculateRemainingDays, formatDate } from '@/utils/helpers';
import type { CompaniesTableArray } from '@/utils/types';

import Pagination from '../pagination';
import { EditLink, StatusLink } from './tableLinks';

export default function AllCompaniesTable({
  companies: initialCompanies,
  page,
  itemsPerPage,
  totalCount,
  totalPages,
}: {
  companies: CompaniesTableArray;
  page: number;
  itemsPerPage: number;
  totalCount: number;
  totalPages: number;
}) {
  const [companies, setCompanies] = useState(initialCompanies);
  const router = useRouter();
  const handleStatusChange = (id: string, newStatus: boolean) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.id === id ? { ...company, isActive: newStatus } : company,
      ),
    );
    router.refresh();
  };

  const handleCompanyUpdated = (
    id: string,
    updatedCompany: {
      companyName: string;
    },
  ) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.id === id ? { ...company, ...updatedCompany } : company,
      ),
    );
    router.refresh();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-300 text-sm uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="w-1/5 p-4">
                User
              </th>
              <th scope="col" className="w-[15%] p-2">
                API Key
              </th>
              <th scope="col" className="w-[10%] p-2">
                Status
              </th>
              <th scope="col" className="w-[30%] p-2">
                Created by
              </th>
              <th scope="col" className="w-[15%] p-2">
                Subscription
              </th>
              <th scope="col" className="w-[10%] p-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
              companies.map((company) => (
                <tr
                  key={company.id}
                  className="group border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <td className="flex items-center space-x-3 p-4">
                    <Avatar
                      image={company.logo || ''}
                      name={company.companyName || ''}
                      contextType="profile"
                    />
                    <div className="flex max-w-[calc(100%-3rem)] flex-col">
                      <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {company.companyName}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-2">
                    <span className="font-mono text-xs">{company.apiKey}</span>
                  </td>
                  <td className="whitespace-nowrap p-2 font-medium text-gray-900 dark:text-white">
                    <span
                      className={clsx(
                        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium  ring-1 ring-inset ',
                        company.isActive
                          ? 'bg-green-50 text-green-700 ring-green-600/20'
                          : 'bg-gray-50 text-gray-700 ring-gray-700',
                      )}
                    >
                      {company.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap p-2 font-medium dark:text-white">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center">
                        <UserIcon className="mr-2 size-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {company.creatorName || 'System'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <EnvelopeIcon className="mr-2 size-4 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {company.creatorEmail || 'system@example.com'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 size-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Created on {formatDate(company.createdAt)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-2 font-medium text-gray-900 dark:text-white">
                    {company.isTrial ? (
                      <div className="flex items-center">
                        <span className="mr-2 size-2 shrink-0 rounded-full bg-yellow-400" />
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                          Trial
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {company.expireDate
                            ? `${calculateRemainingDays(company.expireDate)} days left`
                            : '0 days left'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="mr-2 size-2 shrink-0 rounded-full bg-blue-500" />
                        <span className="flex items-center space-x-1 text-sm font-medium text-blue-700 dark:text-blue-400">
                          <span>Subscribed</span>
                          {company.subscription && (
                            <a
                              href={`https://dashboard.stripe.com/subscriptions/${company.subscription.stripeSubscriptionId}`}
                              className="ml-3 text-blue-500 transition-colors hover:text-blue-700 hover:underline"
                              target="_blank"
                            >
                              <OpenInNewWindowIcon className="size-4" />
                            </a>
                          )}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap p-2 font-medium text-gray-900 dark:text-white">
                    <div className="flex space-x-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="relative">
                        <EditLink
                          id={company.id}
                          onCompanyUpdated={handleCompanyUpdated}
                        />
                      </div>

                      <div className="relative">
                        <StatusLink
                          status={company.isActive}
                          id={company.id}
                          onStatusChange={handleStatusChange}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  <span className="text-lg text-gray-500">No data found</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPages={totalPages}
        page={page}
        itemsPerPage={itemsPerPage}
        totalCount={totalCount}
      />
    </>
  );
}
