'use client';

import { Status } from '@/lib/types';

interface DeadlinePillProps {
  deadline: string;
  status: Status;
}

export default function DeadlinePill({ deadline, status }: DeadlinePillProps) {
  if (status === 'Хүргэгдсэн' || status === 'Цуцалсан') {
    return (
      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-[#E6EDEB] text-[#6B7C78]">
        Эцсийн: {deadline}
      </span>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadline);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (diff < 0) {
    return (
      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">
        ⚠ {Math.abs(diff)} хоног хэтэрсэн
      </span>
    );
  }
  if (diff === 0) {
    return (
      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
        ⏳ Өнөөдөр дуусна
      </span>
    );
  }
  if (diff <= 7) {
    return (
      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
        ⏳ {diff} хоног үлдсэн
      </span>
    );
  }
  return (
    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
      ⏳ {diff} хоног үлдсэн
    </span>
  );
}
