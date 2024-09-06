'use client';
import { Avatar } from '@/components/ui/avatar';
import clsx from 'clsx';
import { EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';
import { CalendarIcon } from '@radix-ui/react-icons';
import { calculateRemainingDays, formatDate } from '@/utils/helpers';
import Pagination from '../pagination';
import { EditLink, StatusLink } from './tableLinks';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormattedCompaniesTable {
  id: string;
  company_name: string;
  logo: string;
  api_key: string;
  is_active: boolean;
  creatorName: string;
  creatorEmail: string;
  created_at: string;
  is_trial: boolean;
  expire_date: string;
}
export default function AllCompaniesTable({
  companies: initialCompanies,
  page,
  itemsPerPage,
  totalCount,
  totalPages,
}: {
  companies: FormattedCompaniesTable[];
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
        company.id === id ? { ...company, is_active: newStatus } : company,
      ),
    );
    router.refresh();
  };

  const handleCompanyUpdated = (
    id: string,
    updatedCompany: {
      company_name: string;
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
        <table className="w-full min-w-[1000px] text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-sm text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4 w-[20%]">
                User
              </th>
              <th scope="col" className="p-2 w-[15%]">
                API Key
              </th>
              <th scope="col" className="p-2 w-[10%]">
                Status
              </th>
              <th scope="col" className="p-2 w-[30%]">
                Created by
              </th>
              <th scope="col" className="p-2 w-[15%]">
                Subscription
              </th>
              <th scope="col" className="p-2 w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
              companies.map((company) => (
                <tr
                  key={company.id}
                  className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <td className="p-4 flex items-center space-x-3">
                    <Avatar
                      image={company.logo || ''}
                      name={company.company_name || ''}
                      contextType="profile"
                    />
                    <div className="flex flex-col max-w-[calc(100%-3rem)]">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {company.company_name}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <span className="font-mono text-xs">{company.api_key}</span>
                  </td>
                  <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <span
                      className={clsx(
                        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium  ring-1 ring-inset ',
                        company.is_active
                          ? 'bg-green-50 text-green-700 ring-green-600/20'
                          : 'bg-gray-50 text-gray-700 ring-gray-700',
                      )}
                    >
                      {company.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-2 font-medium whitespace-nowrap dark:text-white">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center">
                        <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {company.creatorName || 'System'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {company.creatorEmail || 'system@example.com'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-xs text-gray-500">
                          Created on {formatDate(company.created_at)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {company.is_trial ? (
                      <div className="flex items-center">
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                          Trial
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {calculateRemainingDays(company.expire_date)} days left
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                          Subscribed
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="relative">
                        <EditLink id={company.id} onCompanyUpdated={handleCompanyUpdated} />
                      </div>

                      <div className="relative">
                        <StatusLink
                          status={company.is_active}
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
                <td colSpan={6} className="text-center p-6">
                  <span className="text-gray-500 text-lg">No data found</span>
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
