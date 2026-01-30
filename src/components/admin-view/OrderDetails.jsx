import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Separator } from "@radix-ui/react-dropdown-menu";
import CommonForm from "../common/form";
import { useDispatch } from "react-redux";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  getAdminOrderDetails,
  getALlUserOrderList,
  updateOrderStatus,
} from "@/store/admin/order-slice";

const initialFormData = {
  status: "",
};

function AdminOrderDetails({ orderDetails }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);

  function handleUpdateStatus(e) {
    e.preventDefault();
    const { Status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: Status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getALlUserOrderList());
        dispatch(getAdminOrderDetails(orderDetails?._id));
        setFormData(initialFormData);
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle>Event Attendance Details</DialogTitle>

      <div className="grid gap-6">
        {/* User info */}
        <div className="grid gap-2 mt-4">
          <h3 className="font-semibold text-lg">Attendee Information</h3>
          <div className="flex justify-between">
            <p>Name</p>
            <Label>{orderDetails?.userId?.userName}</Label>
          </div>
          <div className="flex justify-between">
            <p>Email</p>
            <Label>{orderDetails?.userId?.email}</Label>
          </div>
        </div>

        <Separator />

        {/* Order Info */}
        <div className="grid gap-2">
          <h3 className="font-semibold text-lg">Order Information</h3>

          <div className="flex justify-between">
            <p>Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>

          <div className="flex justify-between">
            <p>Payment Date</p>
            <Label>{orderDetails?.paymentDate?.split("T")[0]}</Label>
          </div>

          <div className="flex justify-between">
            <p>Payment Method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>

          <div className="flex justify-between">
            <p>Total Amount</p>
            <Label>$ {orderDetails?.totalAmount}</Label>
          </div>

          <div className="flex justify-between">
            <p>Ticket Count</p>
            <Label>{orderDetails?.ticketCount}</Label>
          </div>

          <div className="flex justify-between">
            <p>Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>

          <div className="flex justify-between">
            <p>Event Status</p>
            <Label>{orderDetails?.eventStatus}</Label>
          </div>
        </div>

        <Separator />

        {/* Update Status */}
        <div>
          <CommonForm
            formcontrols={[
              {
                label: "Event Status",
                name: "Status",
                componentType: "select",
                options: [
                  { id: "registered", label: "Registered" },
                  { id: "confirmed", label: "Confirmed" },
                  { id: "attended", label: "Attended" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateStatus}
            buttonText="Update Event Status"
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetails;
