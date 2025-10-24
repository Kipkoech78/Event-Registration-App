export const LoginFormControls = [
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];

export const eventFormControls = [
  {
    label: "Event Title",
    name: "title",
    componentType: "text",
    placeholder: "Enter event name",
    required: true,
  },
  {
    label: "Event Type",
    name: "type",
    componentType: "select",
    options: [
      { label: "Exhibition", id: "exhibition" },
      { label: "Conference", id: "conference" },
      // Optional: Add more event types if needed
    ],
    required: true,
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Describe the event",
    required: true,
  },
  {
    label: "Start Date & Time",
    name: "startDate",
    type: "datetime-local",
    required: true,
  },
  {
    label: "End Date & Time",
    name: "endDate",
    type: "datetime-local",
    required: true,
  },
  {
    label: "Location / Venue",
    name: "location",
    type: "text",
    placeholder: "Enter event location",
    required: true,
  },
  {
    label: "Ticket Price",
    name: "price",
    type: "number",
    placeholder: "0 (Free) or enter price",
    required: true,
  },
  {
    label: "Capacity / Max Attendees",
    name: "capacity",
    type: "number",
    placeholder: "Enter total seats available",
    required: true,
  },
];

export const registerFormControls = [
  {
    label: "User Name",
    name: "userName",
    type: "text",
    placeholder: "Enter your first name",
    required: true,
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm your password",
    required: true,
  },
];
