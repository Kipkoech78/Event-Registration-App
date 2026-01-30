import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventDetailsById } from "@/store/exhibition/event-slice";
import {
  createEventPayment,
  CreateMpesaPayment,
} from "@/store/exhibition/payment-slice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import CommonForm from "../common/form";
import { RegisterEventFormControl } from "@/config";

const initialState = {
  amount: 0,
  email: "",
  fname: "",
  lname: "",
  company: "",
  number: "",
  position: "",
  type: "",
};

function EventDetailsPage() {
  const [formData, setFormData] = useState(initialState);
  const [openSheet, setOpenSheet] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCapacityFull, setCapacityFull] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const { eventDetails } = useSelector((state) => state.exhibitionEvent);
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.payment);

  // Fetch event details
  useEffect(() => {
    if (id) dispatch(fetchEventDetailsById(id));
  }, [id, dispatch]);

  // Update total price when ticket count or event changes
  useEffect(() => {
    if (eventDetails?.price) {
      setTotalPrice(eventDetails.price * ticketCount);
    }
  }, [ticketCount, eventDetails]);

  // Always update formData amount
  useEffect(() => {
    setFormData((prev) => ({ ...prev, amount: totalPrice }));
  }, [totalPrice]);
  useEffect(() => {
    if (eventDetails?.capacity <= 0) {
      setCapacityFull(true);
    } else {
      setCapacityFull(false);
    }
  }, [eventDetails]);

  // Form validation
  function validateForm(data) {
    const { email, fname, lname, number } = data;
    if (!fname.trim() || !lname.trim() || !email.trim() || !number.trim()) {
      return "All fields are required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    const phoneRegex = /^[0-9]{9,12}$/;
    const formattedPhone = number.startsWith("0") ? number.slice(1) : number;
    if (!phoneRegex.test(formattedPhone)) return "Invalid phone number";
    return null;
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationError = validateForm(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (totalPrice === 0) {
      // Free event
      const bookingData = {
        eventId: eventDetails._id,
        eventTitle: eventDetails.title,
        userId: user?.id || null,
        userName: user?.userName || "Guest User",
        userEmail: formData.email,
        tickets: 1,
        totalPrice: 0,
        paymentDate: new Date(),
        paymentMethod: "FREE",
      };
      dispatch(createEventPayment(bookingData)).then((res) => {
        if (res?.payload?.success) {
          toast.success("Successfully registered for free!");
          setOpenSheet(false);
        } else {
          toast.error("Registration failed");
        }
      });
      return;
    }

    // Paid event
    dispatch(
      CreateMpesaPayment({
        ...formData,
        amount: totalPrice,
        eventId: eventDetails._id,
        eventTitle: eventDetails.title,
      })
    ).then(async (data) => {
      if (data?.payload?.success) {
        toast(data.payload.message || "STK sent success check your Phone");

        //wait 2.5 seconds before closing sheet
        await delay(2500);

        setOpenSheet(false);
      } else {
        toast.error(data?.payload?.message || "Payment failed");

        //optional: also delay on failure
        await delay(2500);
      }
    });
  };

  // Always render, use conditional inside JSX
  if (!eventDetails) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-lg text-gray-500">
        Loading event details...
      </div>
    );
  }

  const images =
    eventDetails?.venueImages?.length > 0
      ? eventDetails.venueImages
      : [eventDetails.bannerImage || "/placeholder.jpg"];

  const formattedDate = new Date(eventDetails.startDate).toLocaleString(
    "en-GB",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh]">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {images.map((img, i) => (
              <CarouselItem key={i}>
                <img
                  src={img}
                  alt={eventDetails.title}
                  className="w-full h-[60vh] object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-2 bg-black/50 text-white hover:bg-black/70" />
              <CarouselNext className="right-2 bg-black/50 text-white hover:bg-black/70" />
            </>
          )}
        </Carousel>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 sm:p-12 text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            {eventDetails.title}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm sm:text-base">
            <Badge className="bg-red-500">{eventDetails.type}</Badge>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{eventDetails.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto py-10 px-5 gap-8">
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">About the Event</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {eventDetails.description}
          </p>
          <div className="text-2xl font-semibold mt-6">
            🎟️ Ticket Price:{" "}
            <span className="text-blue-600">Ksh {eventDetails.price}</span>
          </div>
        </div>

        {/* Register Panel */}
        <div className="lg:w-[350px] bg-gray-50 border rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-3">Ready to Attend?</h3>
            <p className="text-gray-600 mb-6">
              Don’t miss this amazing event! Reserve your spot now.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            onClick={() => setOpenSheet(true)}
            disabled={isCapacityFull}
          >
            {eventDetails.price === 0 ? "Register for Free" : "Buy Ticket(s)"}
          </Button>
        </div>
      </div>

      {/* Sheet for Ticket Purchase */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[450px] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>
              {eventDetails.price === 0
                ? "Register for Free"
                : `Buy Tickets for ${eventDetails.title}`}
            </SheetTitle>
          </SheetHeader>
          {isCapacityFull && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              This event is fully booked. Payments are disabled.
            </div>
          )}
          {isLoading && (
            <p className="text-sm text-gray-500 mt-2">
              Sending STK prompt to your phone…
            </p>
          )}

          <div className="mt-6 space-y-6">
            <CommonForm
              formcontrols={RegisterEventFormControl}
              buttonText={
                eventDetails.price === 0
                  ? "Register for Free"
                  : "Buy Ticket to Register"
              }
              onSubmit={handleRegister}
              formData={formData}
              isBtnDisabled={isLoading || isCapacityFull}
              setFormData={setFormData}
            />

            <div className="mt-4 text-lg font-semibold">
              Total Price:{" "}
              <span className="text-blue-600">Ksh {totalPrice}</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default EventDetailsPage;
