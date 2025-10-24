import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function EventDetailsDialog({ open, setOpen, eventDetails }) {
  console.log("items in details page ", eventDetails);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  function handleDialogClose() {
    setOpen(false);
  }
  function handleAddReview() {}

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid, grid-cols-2 gap-8 sm:p-8 max-w-[100vw]  sm:max-w-[60vw] lg:max-w-[80vw] ">
        <div className="relative overflow-hidden rounded-lg ">
          <img
            src={eventDetails?.image}
            alt={eventDetails?.title}
            width={700}
            height={700}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="grid min-h-[500px]  gap-1">
          <div className="max-h-[300px] ">
            <h1 className="text-3xl font-extrabold">{eventDetails?.title} </h1>
            <p className="text-muted-foreground pt-5 min-h-{300px]  text-2xl mb-4">
              {eventDetails?.description.slice(0, 300)}{" "}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`${
                eventDetails?.salePrice > 0 ? "line-through " : ""
              } text-3xl font-bold text-primary `}
            >
              ${eventDetails?.salePrice}{" "}
            </p>
            {eventDetails?.totalStock === 0 ? (
              <Badge
                className="absolute top-2 bg-red-500 hover:bg-red-700 left-2"
                variant="outline"
              >
                Out Of Stock
              </Badge>
            ) : eventDetails?.totalStock < 10 ? (
              <Badge
                className="absolute top-2 bg-red-500 hover:bg-red-700 left-2"
                variant="outline"
              >
                {`only ${eventDetails?.totalStock} Remaining`}{" "}
              </Badge>
            ) : eventDetails?.price > 0 ? (
              <p className="text-3xl font-bold text-primary">
                $ : {eventDetails?.price}{" "}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              ({eventDetails?.averageReview?.toFixed(2)})
            </span>
          </div>
          <div className="mt-5 mb-5">
            {eventDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Add to cart
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleAddtoCart(eventDetails?._id, eventDetails?.totalStock)
                }
                className="w-full"
              >
                Add to cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[200px] overflow-auto ">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-3">
            </div>
          </div>
          <div className="mt-6 min-h-[100px] max-h-[200px] flex flex-col gap-2">
            <Input
              name="reviewMsg"
              value={reviewMsg}
              onChange={(event) => {
                setReviewMsg(event.target.value);
              }}
              className="shadow-lg"
              placeholder="write a review..."
            />
            <Button
              onClick={handleAddReview}
              disabled={reviewMsg.trim() === ""}
            >
              Submit
            </Button>
          </div>
        </div>
        <DialogDescription> @all right served </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
export default EventDetailsDialog;
