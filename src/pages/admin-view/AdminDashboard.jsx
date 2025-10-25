import { fetchEventsSummary } from '@/store/admin/event-slice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#0088FE", "#FFBB28"];

function AdminDashboard() {
  const {summaryList, isLoading} = useSelector((state)=>state.adminEvents)

  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(fetchEventsSummary())

  },[dispatch])
  console.log("event summary", summaryList)

  
  if (isLoading) return <div className="text-center mt-10 text-lg">Loading dashboard...</div>;

  // 🧮 Aggregate totals
  const totalRevenue = summaryList.reduce((sum, ev) => sum + ev.totalPaidAmount, 0);
  const totalTickets = summaryList.reduce((sum, ev) => sum + ev.ticketsSold, 0);
  const totalAttendees = summaryList.reduce((sum, ev) => sum + ev.attendees, 0);

  // 💡 Pie chart data: event revenue distribution
  const revenueDistribution = summaryList.map((ev) => ({
    name: ev.eventTitle,
    value: ev.totalPaidAmount,
  }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">🎟️ Event Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">Total Revenue</h2>
            <p className="text-3xl font-semibold text-blue-600 mt-2">Ksh {(totalRevenue*128).toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">Tickets Sold</h2>
            <p className="text-3xl font-semibold text-green-600 mt-2">{totalTickets}</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">People Attended</h2>
            <p className="text-3xl font-semibold text-purple-600 mt-2">{totalAttendees}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Revenue Distribution Pie */}
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Revenue by Event</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {revenueDistribution.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ticket Sales per Event */}
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Tickets Sold per Event</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summaryList}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="eventTitle" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ticketsSold" fill="#82ca9d" name="Tickets Sold" />
                <Bar dataKey="attendees" fill="#8884d8" name="Attendees" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Event Table */}
      <div className="mt-6">
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Event Summary Table</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-700">
                  <th className="p-3">Event Title</th>
                  <th className="p-3">Tickets Sold</th>
                  <th className="p-3">Revenue (Ksh)</th>
                  <th className="p-3">Attendees</th>
                </tr>
              </thead>
              <tbody>
                {summaryList.map((event, index) => (
                  <tr key={index} className="border-t text-sm hover:bg-gray-50">
                    <td className="p-3">{event.eventTitle}</td>
                    <td className="p-3">{event.ticketsSold}</td>
                    <td className="p-3">{event.totalPaidAmount.toFixed(2)}</td>
                    <td className="p-3">{event.attendees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard