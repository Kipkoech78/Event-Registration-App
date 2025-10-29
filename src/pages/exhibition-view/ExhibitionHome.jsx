import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchEventDetailsById, fetchFilteredEvents } from "@/store/exhibition/event-slice";
import { CloudLightning, ShirtIcon, CalendarDays, MapPin } from "lucide-react";
import EventTile from "@/components/exhibition-view/eventTile";

const categoryWithIcon = [
  { id: "conference", label: "Conference", icon: ShirtIcon },
  { id: "exhibition", label: "Exhibition", icon: CloudLightning },
];

function ExhibitionHome() {
  const { user } = useSelector((state) => state.auth);
  const { eventList } = useSelector((state) => state.exhibitionEvent);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchFilteredEvents({ filterParams: {}, sortParams: "price-lowtohigh" }));
  }, [dispatch]);

  const handleNavigateToListing = (item, section) => {
    sessionStorage.removeItem("filters");
    const currentFilters = { [section]: [item.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilters));
    navigate(`/exhibition/listing`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* hero*/}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Discover & Experience Amazing Events
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          Join thousands of professionals, creators, and innovators. 
          Explore exhibitions, conferences, and networking events near you.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="font-semibold shadow-md hover:bg-blue-50 text-blue-800"
          onClick={() => navigate("/exhibition/listing")}
        >
          Explore Events
        </Button>
      </section>

      {/* category */}
      <section className="py-14 px-6 md:px-12 bg-background">
        <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
          {categoryWithIcon.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleNavigateToListing(item, "category")}
                className="cursor-pointer group w-full max-w-[160px] bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition-all flex flex-col items-center"
              >
                <Icon className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition" />
                <p className="font-semibold text-gray-700 group-hover:text-blue-700">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* featured events */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Events</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/exhibition/listing")}
          >
            View All
          </Button>
        </div>

        {eventList && eventList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventList.slice(0, 6).map((event) => (
              <EventTile key={event.id} event={event} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No events available right now.</p>
        )}
      </section>

      {/* cta footer*/}
      <footer className="mt-auto bg-indigo-900 text-white text-center py-10 px-4">
        <h3 className="text-xl font-semibold mb-3">Ready to Host Your Event?</h3>
        <p className="text-indigo-200 mb-6">
          Join our network and reach thousands of event-goers instantly.
        </p>
        <Button
          variant="secondary"
          onClick={() => navigate("/exhibition/create")}
          className="text-indigo-800 font-semibold hover:bg-indigo-50"
        >
          Create Event
        </Button>
        <p className="text-indigo-300 text-sm mt-6">
          © {new Date().getFullYear()} ExpoSphere. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default ExhibitionHome