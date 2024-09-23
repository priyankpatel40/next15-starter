'use client';

import type { User } from '@prisma/client';
import { PlusIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import AddUserModal from './addusermodal';

const AddUserButton = ({ onUserAdded }: { onUserAdded: (user: User) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('UsersPage.AddUserModal');
  const handleUserAdded = (user: User) => {
    onUserAdded(user);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex w-full items-center justify-center sm:w-auto">
          <PlusIcon className="mr-2 size-5" /> {t('btn')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <AddUserModal onClose={() => setIsOpen(false)} onUserAdded={handleUserAdded} />
      </DialogContent>
    </Dialog>
  );
};
export default AddUserButton;
