import { useState } from "react";
import CustomCalendar from "./CustomCalendar.jsx";
import Contact from "./Contact.jsx";
import { addWeeks, format } from "date-fns";

const ContactSection = ({ floor }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    fromDate: format(new Date(), "yyyy-MM-dd"),
    toDate: format(new Date(addWeeks(new Date(), 1)), "yyyy-MM-dd"),
    option: floor,
  });

  return (
    <div
      id="contact"
      className="gap-5 ms:gap-14 md:gap-0 md:grid-cols-2 grid pt-20 max-w-screen-xl mx-auto"
    >
      <CustomCalendar floor={floor} form={form} setForm={setForm} />
      <Contact floor={floor} form={form} setForm={setForm} />
    </div>
  );
};

export default ContactSection;
