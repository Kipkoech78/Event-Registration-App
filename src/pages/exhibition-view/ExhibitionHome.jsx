import { fetchEventDetailsById, fetchFilteredEvents } from '@/store/exhibition/event-slice';
import { CloudLightning, ShirtIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const categoryWithIcon = [
  { id: "conference", label: "Conference", icon: ShirtIcon },
  { id: "exhibition", label: "Exhibition", icon: CloudLightning },

];
function ExhibitionHome() {

  const {user} = useSelector((state)=> state.auth);
  const {eventList, eventDetails} = useSelector((state)=> state.exhibitionEvent)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleNavigateToListing(item, section) {
    sessionStorage.removeItem("filters");
    const currentFilters = {
      [section]: [item.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilters));
    navigate(`/exhibition/listing`);
  }

  useEffect(() => {
    dispatch(
      fetchFilteredEvents({ filterParams: {}, sortParams: "price-lowtohigh" })
    );
  }, [dispatch]);
  function handleGetEventDetails(getCurentProductId) {
    console.log(getCurentProductId);
    dispatch(fetchEventDetailsById(getCurentProductId));
  }
  return (
    <div>{eventList}</div>
  )
}

export default ExhibitionHome