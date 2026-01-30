import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CalendarDays, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ----------------------------------
   Helper: Countdown calculation
----------------------------------- */
function getTimeRemaining(targetDate) {
  const total = Date.parse(targetDate) - Date.now();

  if (total <= 0) return null;

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

function EventTile({ event }) {
  const navigate = useNavigate();

  /* ----------------------------------
     Images
  ----------------------------------- */
  const images = useMemo(() => {
    if (event?.venueImages?.length > 0) return event.venueImages;
    if (event?.bannerImage) return [event.bannerImage];
    return ["/placeholder.jpg"];
  }, [event]);

  /* ----------------------------------
     Date & Status
  ----------------------------------- */
  const formattedDate = useMemo(
    () =>
      new Date(event.startDate).toLocaleString("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [event.startDate]
  );

  const isUpcoming = new Date(event.startDate) >= new Date();

  /* ----------------------------------
     Countdown Timer
  ----------------------------------- */
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeRemaining(event.startDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(event.startDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [event.startDate]);

  /* ----------------------------------
     Seats
  ----------------------------------- */
  const availableSeats = event.capacity - (event.guests?.length || 0);

  const isSoldOut = availableSeats <= 0;

  return (
    <Card className="w-full mx-auto mb-6 overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
      {/* ---------------- Carousel ---------------- */}
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="relative w-full h-[300px]"
      >
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={index}>
              <img
                src={img}
                alt={`Event image ${index + 1}`}
                className="w-full h-[300px] object-cover rounded-[5px]"
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

        <Badge className="absolute top-3 left-3 bg-red-600 text-white">
          {event.type || "Event"}
        </Badge>

        <Badge
          className={`absolute top-3 right-3 ${
            isUpcoming ? "bg-green-600" : "bg-gray-500"
          }`}
        >
          {isUpcoming ? "Upcoming" : "Past"}
        </Badge>
      </Carousel>

      {/* ---------------- Content ---------------- */}
      <CardContent className="p-5 space-y-3">
        <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>

        <p className="text-sm text-gray-600 line-clamp-3">
          {event.description}
        </p>

        <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-1 mt-1 sm:mt-0">
            <CalendarDays className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Countdown */}
        {timeLeft && isUpcoming && (
          <div className="text-sm font-medium text-red-600">
            Starts in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
            {timeLeft.seconds}s
          </div>
        )}

        {/* Price */}
        {event.price > 0 && (
          <p className="text-lg font-semibold text-gray-900">
            Ticket Price: Ksh {event.price}
          </p>
        )}

        {/* Seats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700">
            Available Seats:
            <span className="font-semibold ml-1">{availableSeats}</span>
          </span>

          {isSoldOut && (
            <Badge className="bg-red-600 text-white">Sold Out</Badge>
          )}
        </div>
      </CardContent>

      {/* ---------------- Footer ---------------- */}
      <CardFooter className="p-4">
        <Button
          disabled={isSoldOut}
          onClick={() => navigate(`/exhibition/event/${event._id}`)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
        >
          View Event
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EventTile;
