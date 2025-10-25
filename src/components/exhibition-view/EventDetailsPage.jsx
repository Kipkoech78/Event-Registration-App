import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventDetailsById } from "@/store/exhibition/event-slice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Plus, Minus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { createEventPayment } from "@/store/exhibition/payment-slice";
import { toast } from "sonner";

function EventDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { eventDetails } = useSelector((state) => state.exhibitionEvent);
  const { user } = useSelector((state) => state.auth); 
  const {isLoading,approvalURL,payments,eventOrderId,EventOrderDetails} = useSelector((state)=> state.payment)

  const [openSheet, setOpenSheet] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (id) dispatch(fetchEventDetailsById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (eventDetails?.price) {
      setTotalPrice(eventDetails.price * ticketCount);
    }
  }, [ticketCount, eventDetails]);

  if (!eventDetails)
    return (
      <div className="flex items-center justify-center h-[80vh] text-lg text-gray-500">
        Loading event details...
      </div>
    );
  const images =
    eventDetails?.venueImages?.length > 0
      ? eventDetails.venueImages
      : [eventDetails.bannerImage || "/placeholder.jpg"];

  const formattedDate = new Date(eventDetails.startDate).toLocaleString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // handle registration (placeholder)
  const handleRegister = () => {
    const bookingData = {
      eventId: eventDetails._id,
      eventTitle: eventDetails.title,
      userId: user.id,
      userName: user?.userName || "Guest User",
      userEmail: user?.email || "guest@example.com",
      tickets: ticketCount,
      totalPrice,
      paymentDate: new Date()
    };
    dispatch(createEventPayment(bookingData)).then((data)=>{
      console.log(data)
      if(data?.payload?.success){
        toast("payment request sent")
        setOpenSheet(false)
      }else{
        toast("error occured requesting payment")
      }
    })
    if(approvalURL){
      window.location.href = approvalURL
    }

    console.log("Submitting booking:", bookingData);
    
   
  };

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
            disabled ={isLoading}
          >
            Buy Tickets
          </Button>
        </div>
      </div>

      {/* Sheet for Ticket Purchase */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="w-[400px] sm:w-[450px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Buy Tickets for {eventDetails.title}</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* User Info */}
            <div>
              <p className="text-sm text-gray-500">User</p>
              <Input value={user?.userName || "Guest User"} disabled className="mb-2" />
              <Input value={user?.email || "guest@example.com"} disabled />
            </div>

            {/* Ticket Counter */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Number of Tickets</p>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setTicketCount((prev) => Math.max(1, prev - 1))}
                >
                  <Minus />
                </Button>
                <span className="text-lg font-semibold">{ticketCount}</span>
                <Button variant="outline" onClick={() => setTicketCount((prev) => prev + 1)}>
                  <Plus />
                </Button>
              </div>
            </div>

            {/* Total Price */}
            <div className="mt-4 text-lg font-semibold">
              Total Price: <span className="text-blue-600">Ksh {totalPrice}</span>
            </div>

            {/* Submit */}
            <Button
              className="bg-green-600 hover:bg-green-700 text-white w-full mt-6"
              onClick={handleRegister}
            >
              {isLoading ? "Processing payments..." :"Confirm Purchase"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default EventDetailsPage;
