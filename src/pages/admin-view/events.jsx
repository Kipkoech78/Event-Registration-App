const baseURL = import.meta.env.VITE_API_BASE_URL;
import AdminImageUpload from "@/components/admin-view/AdminImageAppload";
import AdminEventsTile from "@/components/admin-view/eventsTile";
import EventImageUpload from "@/components/admin-view/uploadImage";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { eventFormControls } from "@/config";
import {
  addNewEvent,
  deleteEvents,
  editEvents,
  fetchAllEvents,
} from "@/store/admin/event-slice";
import axios from "axios";

import { DiscIcon } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function AdminEvents() {
  const initialFormData = {
    title: "",
    type: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    price: "",
    capacity: "",
    bannerImage: null,
    venueImages: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [uploadedbannerImageUrl, setUploadedbannerImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const [bannerImageLoadingState, setBannerImageLoadingState] = useState(false)
  const [openCreateEventDialog, setCreateEventDialog] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { EventList } = useSelector((state) => state.adminEvents);
  const dispatch = useDispatch();

  function onSubmit(e) {
    e.preventDefault();
    //console.log(" Form data", formData)
    currentEditedId !== null
      ? dispatch(
          editEvents({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log("Edited Product", data);
          if (data?.payload?.success) {
            setCreateEventDialog(false);
            setCurrentEditedId(null);
            toast("Event edited success");
          }
        })
      : dispatch(
          addNewEvent({
            ...formData,
            venueImages:uploadedImageUrls,
            bannerImage:uploadedbannerImageUrl
          })
        ).then((data) => {
          console.log(data, "data after submit");
          if (data?.payload?.success) {
            dispatch(fetchAllEvents());
            setCreateEventDialog(false);
            setImageFile(null);
            setBannerImageFile(null)
            setFormData(initialFormData);
            toast("Event added success");
          }
        });
  }
  function handleDelete(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(deleteEvents(getCurrentProductId)).then((data) => {
      console.log(data?.payload);
      if (data?.payload?.success) {
        dispatch(fetchAllEvents());
      }
    });
  }
  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);
  return (
    <Fragment>
      <div
        onClick={() => setCreateEventDialog(true)}
        className="flex justify-end mb-5 w-full"
      >
        <Button>Create new Event</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {EventList && EventList.length > 0
          ? EventList.map((Item) => (
              <AdminEventsTile
                key={Item.id}
                setFormData={setFormData}
                setCreateEventDialog={setCreateEventDialog}
                setCurrentEditedId={setCurrentEditedId}
                currentEditedId={currentEditedId}
                handleDelete={handleDelete}
                Event={Item}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateEventDialog}
        onOpenChange={() => {
          setCreateEventDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent
          side="bottom"
          className="h-[90vh] max-h-screen overflow-auto rounded-t-xl"
        >
          <SheetHeader>
            <SheetTitle>
              {currentEditedId === null ? "Add New Event" : "Edit Event"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-row gap-6">
            {/* LEFT SIDE - IMAGES & GUEST LIST */}
            <div className="flex-1 space-y-6">
              {/* Banner Image */}
              <EventImageUpload
                imageFile={imageFile}
                uploadedImageUrls={uploadedImageUrls}
                setImageFile={setImageFile}
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
                isEditMode={currentEditedId !== null}
                setUploadedImageUrl={setUploadedImageUrls}
              />

              {/* Venue Images */}
              <AdminImageUpload
                bannerImageFile={bannerImageFile}
                uploadedbannerImageUrl={uploadedbannerImageUrl}
                setBannerImageFile={setBannerImageFile}
                imageLoadingState={bannerImageLoadingState}
                setImageLoadingState={setBannerImageLoadingState}
                isEditMode={currentEditedId !== null}
                setUploadedbannerImageUrl={setUploadedbannerImageUrl}
              />
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="flex-1 py-6">
              <CommonForm
                buttonText={
                  currentEditedId !== null ? "Edit Event" : "Add Event"
                }
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                formcontrols={eventFormControls}
                //   isBtnDisabled={currentEditedId === null ? !isFormValid() : null}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminEvents;

// <div className="border rounded-lg p-4">
// <h3 className="font-semibold mb-4">Guest / Celebrity List</h3>

// {formData.guests?.map((guest, index) => (
//   <div
//     key={index}
//     className="flex items-center gap-4 mb-4 border-b pb-4"
//   >
//     {/* Guest Image Upload */}
//     <ImageUploaderWrapper
//       label={`Guest Image ${index + 1}`}
//       multiple={false}
//       onUpload={(url) => handleGuestImageUpload(0, url)}
//     />

//     {/* Guest Name */}
//     <input
//       type="text"
//       placeholder="Guest Name"
//       className="border p-2 rounded w-full"
//       value={guest.name}
//       onChange={(e) => {
//         handleGuestNameChange(index, e.target.value);
//       }}
//     />

//     {/* Remove Button */}
//     <button
//       onClick={() => {
//         const updatedGuests = formData.guests.filter(
//           (_, i) => i !== index
//         );
//         setFormData((prev) => ({
//           ...prev,
//           guests: updatedGuests,
//         }));
//       }}
//       className="text-red-500"
//     >
//       Remove
//     </button>
//   </div>
// ))}

// {/* Add Guest Button */}
// <button
//   onClick={() =>
//     setFormData((prev) => ({
//       ...prev,
//       guests: [...(prev.guests || []), { image: "", name: "" }],
//     }))
//   }
//   className="bg-primary text-white py-2 px-4 rounded"
// >
//   + Add Guest
// </button>
// </div>
