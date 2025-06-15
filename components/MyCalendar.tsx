"use client";  // 重要ポイント

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div>
      <Calendar value={selectedDate} onChange={(date) => setSelectedDate(date as Date)} />
    </div>
  );
}
