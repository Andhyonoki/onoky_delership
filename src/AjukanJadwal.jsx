import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import Sidebar from "./component/Navbar";
import "./AjukanJadwal.css";

dayjs.extend(isoWeek);

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function AjukanJadwal() {
  const location = useLocation();
  const { carId } = location.state || {};

  useEffect(() => {
    if (carId !== undefined) {
      console.log("📦 carId diterima di AjukanJadwal:", carId);
    } else {
      console.warn("⚠️ carId TIDAK ditemukan di location.state!");
    }
  }, [carId]);

  const today = dayjs();
  const [month, setMonth] = useState(today.month());
  const [year, setYear] = useState(today.year());
  const [selectedDate, setSelectedDate] = useState("");
  const [existingSchedules, setExistingSchedules] = useState([]);
  const [userSchedules, setUserSchedules] = useState([]);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchSchedules = async (userId) => {
    try {
      const res = await fetch("https://childish-polydactyl-baritone.glitch.me/schedules");
      const data = await res.json();

      if (Array.isArray(data)) {
        const userDates = data
          .filter((item) => item.userId === userId)
          .map((item) => dayjs(item.date).format("YYYY-MM-DD"));

        const otherDates = data
          .filter((item) => item.userId !== userId)
          .map((item) => dayjs(item.date).format("YYYY-MM-DD"));

        setUserSchedules(userDates);
        setExistingSchedules(otherDates);
      }
    } catch (err) {
      console.error("Gagal mengambil jadwal:", err);
    }
  };

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString);
        setUser(storedUser);
        fetchSchedules(storedUser.id);
      } catch (e) {
        console.error("Gagal parsing user dari localStorage:", e);
      }
    }
  }, []);

  const handleDateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !user) return;

    const formatted = dayjs(selectedDate).format("YYYY-MM-DD");

    if (dayjs(formatted).isBefore(today, "day")) {
      alert("Tidak bisa memilih tanggal yang sudah lewat.");
      return;
    }

    if (existingSchedules.includes(formatted)) {
      alert("Tanggal ini sudah diajukan oleh pengguna lain!");
      return;
    }

    if (userSchedules.includes(formatted)) {
      alert("Tanggal ini sudah kamu ajukan sebelumnya.");
      return;
    }

      const payload = {
      date: formatted,
      userId: user.id,
      carId: carId !== undefined ? Number(carId) : null,
    };


    console.log("📤 Mengirim data jadwal ke backend:", payload);

    try {
      const res = await fetch("https://childish-polydactyl-baritone.glitch.me/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Jadwal berhasil diajukan!");
        setSelectedDate("");
        fetchSchedules(user.id);
      } else {
        const error = await res.text();
        console.error("Respon error:", error);
        alert("Gagal menyimpan jadwal.");
      }
    } catch (err) {
      console.error("Gagal menyimpan jadwal:", err);
      alert("Terjadi kesalahan saat menyimpan jadwal.");
    }
  };

  const generateCalendar = (month, year) => {
    const startDate = dayjs(`${year}-${month + 1}-01`).startOf("week");
    const endDate = dayjs(`${year}-${month + 1}-01`).endOf("month").endOf("week");

    const weeks = [];
    let current = startDate;

    while (current.isBefore(endDate, "day") || current.isSame(endDate, "day")) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(current);
        current = current.add(1, "day");
      }
      weeks.push(week);
    }

    return weeks;
  };

  const calendar = generateCalendar(month, year);

  return (
    <div className="jadwal-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className="jadwal-main-content"
        style={{
          marginLeft: sidebarOpen ? "250px" : "0px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div className="topbar">
          <p>Hello, {user?.name || "Guest"} 👤</p>
        </div>

        <div className="jadwal-box">
          <div className="jadwal-title">Ajukan Jadwal</div>

          <div className="jadwal-controls">
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {monthNames.map((m, idx) => (
                <option key={idx} value={idx}>{m}</option>
              ))}
            </select>

            <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="jadwal-days">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>

          {calendar.map((week, i) => (
            <div className="jadwal-week" key={i}>
              {week.map((date, idx) => {
                const formatted = date.format("YYYY-MM-DD");
                const isCurrentMonth = date.month() === month;
                const isUserDate = userSchedules.includes(formatted);
                const isScheduled = existingSchedules.includes(formatted);

                let className = "jadwal-day";
                if (!isCurrentMonth) className += " not-current";

                let textColor = "";
                if (isUserDate) textColor = "text-green";
                else if (isScheduled) textColor = "text-red";

                return (
                  <div key={idx} className={className}>
                    <span className={textColor}>{date.date()}</span>
                  </div>
                );
              })}
            </div>
          ))}

          <form className="jadwal-form" onSubmit={handleDateSubmit}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
            <button type="submit">Ajukan Jadwal</button>
          </form>
        </div>
      </div>
    </div>
  );
}
