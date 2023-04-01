import emailjs from "@emailjs/browser";
import swal from "sweetalert";

const Contact = ({ floor, form, setForm }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  function sendEmail(e) {
    e.preventDefault();
    emailjs
      .send(
        "service_ip2rne9",
        "template_s0qmtox",
        {
          user_email: form.email,
          to_email: "l.eklind1@gmail.com",
          from_name: form.name,
          from_date: form.fromDate,
          to_date: form.toDate,
          message: form.message,
          option: form.option,
        },
        "IlK1fblOIr8WTMBUb"
      )
      .then(
        (result) => {
          swal({
            title: "Meddelandet skickades!",
            text: "Jag återkommer så fort jag kan!",
            icon: "success",
            button: "tillbaka",
          });
          setForm({
            name: "",
            email: "",
            message: "",
            option: "",
            fromDate: "",
            toDate: "",
            option: "",
          });
          console.log(result.text);
        },
        (error) => {
          swal({
            title: "Oops! Något gick fel!",
            text: "Vänligen försök igen",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          });
          console.log(error.text);
        }
      );
  }
  return (
    <div className="sm:p-14 grid px-3">
      <h2
        className="flex-auto text-xl font-semibold text-gray-900"
        id="contact"
      >
        Skicka ett meddelande
      </h2>
      <div className="w-20 h-1 mb-5 bg-indigo-600 rounded-full"></div>
      <form
        onSubmit={sendEmail}
        id="form"
        className="gap-9 flex flex-col px-3 mt-10"
      >
        <div className="sm:grid-cols-1 grid grid-cols-1 gap-4 text-center">
          {floor === "both" && (
            <div>
              <input
                className="peer sr-only"
                id="option1"
                type="radio"
                tabIndex={-1}
                name="option"
                value={"Båda Lägenheterna"}
                onChange={handleChange}
                checked
              />
              <label
                htmlFor="option1"
                className="hover:border-indigo-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white block w-full p-3 border border-gray-200 rounded-lg"
                tabIndex={0}
              >
                <span className="text-sm font-medium"> Båda Lägenheterna</span>
              </label>
            </div>
          )}
          {floor === "bottom" && (
            <div>
              <input
                className="peer sr-only"
                id="option2"
                type="radio"
                tabIndex={-1}
                name="option"
                value={"Bottenvåning"}
                onChange={handleChange}
                checked
              />
              <label
                htmlFor="option2"
                className="hover:border-indigo-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white block w-full p-3 border border-gray-200 rounded-lg"
                tabIndex={0}
              >
                <span className="text-sm font-medium"> Bottenvåning</span>
              </label>
            </div>
          )}
          {floor === "top" && (
            <div>
              <input
                className="peer sr-only"
                id="option3"
                type="radio"
                tabIndex={-1}
                name="option"
                value={"Övervåning"}
                onChange={handleChange}
                checked
              />
              <label
                htmlFor="option3"
                className="hover:border-indigo-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white block w-full p-3 border border-gray-200 rounded-lg"
                tabIndex={0}
              >
                <span className="text-sm font-medium"> Övervåning</span>
              </label>
            </div>
          )}
        </div>
        <label
          htmlFor="UserEmail"
          className="focus-within:border-indigo-600 relative block pt-3 overflow-hidden border-b border-gray-200"
        >
          <input
            type="email"
            id="UserEmail"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="peer focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm w-full h-8 p-0 placeholder-transparent bg-transparent border-none"
          />
          <span className="top-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs absolute left-0 text-xs text-gray-700 transition-all -translate-y-1/2">
            Email
          </span>
        </label>
        <label
          htmlFor="name"
          className="focus-within:border-indigo-600 relative block pt-3 overflow-hidden border-b border-gray-200"
        >
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            placeholder="Förnamn och efternamn"
            onChange={handleChange}
            className="peer focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm w-full h-8 p-0 placeholder-transparent bg-transparent border-none"
          />
          <span className="top-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs absolute left-0 text-xs text-gray-700 transition-all -translate-y-1/2">
            Förnamn och efternamn
          </span>
        </label>
        <div className="flex gap-10">
          <label
            htmlFor="fromDate"
            className="focus-within:border-indigo-600 relative flex-1 block pt-3 overflow-hidden border-b border-gray-200"
          >
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              onChange={handleChange}
              value={form.fromDate}
              className="peer focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm w-full h-8 p-0 placeholder-transparent bg-transparent border-none"
            />
            <span className="top-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs absolute left-0 text-xs text-gray-700 transition-all -translate-y-1/2">
              Från
            </span>
          </label>
          <label
            htmlFor="toDate"
            className="focus-within:border-indigo-600 relative flex-1 block pt-3 overflow-hidden border-b border-gray-200"
          >
            <input
              type="date"
              id="toDate"
              name="toDate"
              value={form.toDate}
              onChange={handleChange}
              className="peer focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm w-full h-8 p-0 placeholder-transparent bg-transparent border-none"
            />
            <span className="top-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs absolute left-0 text-xs text-gray-700 transition-all -translate-y-1/2">
              Till
            </span>
          </label>
        </div>
        <label
          htmlFor="message"
          className="focus-within:border-indigo-600 relative block pt-3 overflow-hidden border-b border-gray-200"
        >
          <textarea
            id="message"
            onChange={handleChange}
            name="message"
            rows={6}
            value={form.message}
            className="peer focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm w-full p-0 placeholder-transparent bg-transparent border-none resize-none"
          ></textarea>
          <span className="top-2 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs absolute left-0 text-xs text-gray-700 transition-all -translate-y-1/2">
            Meddelande
          </span>
        </label>
        <button className="bg-indigo-600 text-lg text-white py-2.5 px-6 rounded-lg hover:bg-indigo-800 w-fit">
          Skicka meddelande
        </button>
      </form>
    </div>
  );
};

export default Contact;
