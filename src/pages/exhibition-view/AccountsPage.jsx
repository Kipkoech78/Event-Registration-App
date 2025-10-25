import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventOrderListbyUser } from "@/store/exhibition/payment-slice";
import jsPDF from "jspdf";

function AccountsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { payments, isLoading } = useSelector((state) => state.payment);
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    if (user?.id) dispatch(getEventOrderListbyUser(user.id));
  }, [dispatch, user]);
  console.log("pay",payments)

  const handleDownloadPDF = (event) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Event Ticket Confirmation", 20, 20);
    doc.setFontSize(12);
    doc.text(`Event: ${event.eventId?.title || "N/A"}`, 20, 40);
    doc.text(`Status: ${event.paymentStatus}`, 20, 50);
    doc.text(`Tickets: ${event.ticketCount}`, 20, 60);
    doc.text(`Total: $${event.totalAmount}`, 20, 70);
    doc.text(`Payment Method: ${event.paymentMethod}`, 20, 80);
    doc.addImage(event.qrCode, "PNG", 20, 90, 80, 80);
    doc.save(`${event.eventId?.title || "ticket"}.pdf`);
  };

  if (isLoading) return <div className="p-4">Loading your orders...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">My Event Tickets</h2>

      {payments?.length === 0 && (
        <div className="text-gray-500">You haven’t booked any events yet.</div>
      )}

      <div className="grid gap-4">
        {payments?.map((event, index) => (
          <div
            key={event._id || index}
            className="p-4 border rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">
                {event.eventId?.title || "Untitled Event"}
              </h3>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span
                  className={`font-medium ${
                    event.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {event.paymentStatus}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Attend Status:{" "}
                <span
                  className={`font-medium ${
                    event.eventStatus === "attended"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {event.eventStatus}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Tickets: {event.ticketCount}
              </p>
              <p className="text-sm text-gray-600">
                Total Amount: ${event.totalAmount}
              </p>
            </div>

            <div className="flex gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => setSelectedQR(event)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                View QR Code
              </button>
              <button
                onClick={() => handleDownloadPDF(event)}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center">
            <h3 className="font-semibold mb-2">
              {selectedQR.eventId?.title || "Event QR Code"}
            </h3>
            <img
              src={selectedQR.qrCode}
              alt="QR Code"
              className="w-64 h-64 mx-auto border p-2"
            />
            <p className="text-sm text-gray-600 mt-2">
              Show this code at the event entrance
            </p>
            <button
              onClick={() => setSelectedQR(null)}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountsPage;
