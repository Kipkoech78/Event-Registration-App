import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
function AdminEventsTile({
  Event,
  setFormData,
  setCreateEventDialog,
  setCurrentEditedId,
  isEditMode,
  handleDelete,
}) {
  console.log("Event", Event);
  return (
    <Card key={Event?._id}>
      <div className="relative">
        <img
          src={Event?.bannerImage}
          alt={Event?.title}
          className="w-full h-[300px] object-cover rounded-t-lg "
        />
      </div>
      <CardContent>
        <h2 className="text-xl font-bold mb-2 mt-2 "> {Event?.title} </h2>
        <span>
          Time: {new Date(Event.startDate).toLocaleDateString()}{" "}
          {new Date(Event.startDate).toLocaleTimeString()}
        </span>

        <div className="flex justify-between items-center mb-2">
          <div>
            <span> {Event.location}</span>
          </div>
          <span
            className={`${
              Event?.salePrice > 0 ? "line-through" : ""
            } text-lg font-semibold text-primary`}
          >
            ksh:{Event?.price}
          </span>

          {Event?.salePrice > 0 ? (
            <span className="text-lg font-bold">Ksh{Event?.salePrice} </span>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button
          onClick={() => {
            setCreateEventDialog(true);
            setCurrentEditedId(Event?._id);
            setFormData(Event);
          }}
        >
          Edit
        </Button>
        <Button
          onClick={() => {
            handleDelete(Event?._id);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
export default AdminEventsTile;
