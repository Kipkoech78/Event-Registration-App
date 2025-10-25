import { Button } from "@/components/ui/button";
import { sortOptions } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DropdownMenuRadioGroup } from "@radix-ui/react-dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import EventTile from "@/components/exhibition-view/eventTile";
import EventFilter from "@/components/exhibition-view/filter";
import { fetchEventDetailsById, fetchFilteredEvents } from "@/store/exhibition/event-slice";
function EventListing() {
  const dispatch = useDispatch();
  const { eventList, eventDetails } = useSelector(
    (state) => state.exhibitionEvent
  );
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const categorySearchParams = searchParams.get("category");

  function handleValueSortChange(value) {
    console.log("value sort clicked", value);
    setSort(value);
  }
  function createSearchParamsHelper(filterParams) {
    const queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }
    console.log("Query params", queryParams);
    return queryParams.join("&");
  }
  function HandleFilter(getSectionId, getCurrentOption) {
    console.log(getSectionId, getCurrentOption);
    let cpyFiltrers = { ...filters };
    const indexOfCurrentSection =
      Object.keys(cpyFiltrers).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      cpyFiltrers = {
        ...cpyFiltrers,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFiltrers[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1)
        cpyFiltrers[getSectionId].push(getCurrentOption);
      else cpyFiltrers[getSectionId].splice(indexOfCurrentOption, 1);
    }
    setFilters(cpyFiltrers);
    //save in storage session
    sessionStorage.setItem("filters", JSON.stringify(cpyFiltrers));
  }

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);
  //pass sort and filters
  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchFilteredEvents({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);
  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParams]);
  console.log(eventList, "itemslisted");

  return (
    <div className="grid  sm: grid-cols-1 md:grid-cols-[200px_1fr]  gap-6 p-4 md:p-6 ">
      <EventFilter filters={filters} HandleFilter={HandleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg shadow-sm font-extrabold">All Events</h2>
          <div className="flex items-center mr-2 gap-2">
            <span className="text-muted-foreground">
              {eventList.length} Events
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="flex gap-1 shadow-sm items-center"
                  size="sm"
                  variant="outlined"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by.</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={handleValueSortChange}
                >
                  {sortOptions.map((sortItems) => (
                    <DropdownMenuRadioItem
                      value={sortItems.id}
                      key={sortItems.id}
                    >
                      {sortItems.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3"> */}
        <div className="w-full "   >
          {eventList && eventList.length > 0
            ? eventList.map((Item) => (
                <EventTile
                  key={Item.id}
                  event={Item}
                  user ={user}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default EventListing;
