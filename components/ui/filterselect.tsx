'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterSelectProps {
  filter: string;
}

export default function FilterSelect({ filter }: FilterSelectProps) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('filter', value);
    } else {
      params.delete('filter');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={filter} onValueChange={handleChange}>
      <SelectTrigger className="w-full rounded-md border border-gray-300 dark:border-gray-600 sm:w-[180px]">
        <SelectValue placeholder="Filter users" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  );
}
