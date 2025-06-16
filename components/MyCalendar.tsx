import { useState } from "react";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";

// ✅ カレンダーをSSR無効で動的インポート
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div style={{ flex: 1 }}>
      <h3>カレンダー</h3>
      <Calendar value={selectedDate} onChange={(date) => setSelectedDate(date as Date)} />
    </div>
  );
}
