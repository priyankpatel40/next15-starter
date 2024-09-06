'use client';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import AddUserModal from './addusermodal';
import { User } from '@prisma/client';

export function AddUserButton({ onUserAdded }: { onUserAdded: (user: User) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleUserAdded = (user: User) => {
    onUserAdded(user);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto flex items-center justify-center">
          <PlusIcon className="h-5 w-5 mr-2" /> Add new user
        </Button>
      </DialogTrigger>
      <DialogContent>
        <AddUserModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onUserAdded={handleUserAdded}
        />
      </DialogContent>
    </Dialog>
  );
}
