import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="w-full flex justify-center mt-3 mb-3">
      {children}
    </div>
  );
}