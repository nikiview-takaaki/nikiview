import dynamic from "next/dynamic";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";

// ✅ SSRを無効化してVercelビルドエラー対策
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div>
      <h3>カレンダー</h3>
      <Calendar value={selectedDate} onChange={(date) => setSelectedDate(date as Date)} />
    </div>
  );
}
