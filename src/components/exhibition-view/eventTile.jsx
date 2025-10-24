import React from "react";
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
import { CalendarDays, MapPin } from "lucide-react";

function EventTile({ event, handleGeteventDetails }) {
  const images =
    event?.venueImages && event.venueImages.length > 0
      ? event.venueImages
      : [event.bannerImage || "/placeholder.jpg"];

  const formattedDate = new Date(event.startDate).toLocaleString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="w-full max-w-4xl mx-auto mb-6 overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
      {/* Image Carousel */}
      <Carousel className="relative w-full h-[300px]">
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={index}>
              <img
                src={img}
                alt={`Event ${index}`}
                className="w-full h-[300px] object-cover"
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
        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
          {event?.type || "Event"}
        </Badge>
      </Carousel>

      {/* Event Info */}
      <CardContent className="p-5 space-y-3">
        <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-3">
          {event.description}
        </p>

        <div className="flex flex-col sm:flex-row justify-between text-gray-700 text-sm mt-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 sm:mt-0">
            <CalendarDays className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {event.price > 0 && (
          <p className="text-lg font-semibold text-gray-900 mt-2">
            Ticket Price: Ksh {event.price}
          </p>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4">
        <Button
          onClick={() => handleGeteventDetails(event._id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          View Event
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EventTile;
