import { useEffect, useState } from "react";
import CustomCalendar from "./CustomCalendar";
import { addWeeks, format } from "date-fns";
import { db, auth } from "../../FirebaseService";
import { MdDateRange } from "react-icons/md/index.js";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import swal from "sweetalert";
import BookingItem from "./BookingItem";

const AddRentings = () => {
  const [form, setForm] = useState({
    fromDate: format(new Date(), "yyyy-MM-dd"),
    toDate: format(new Date(addWeeks(new Date(), 1)), "yyyy-MM-dd"),
    option: "",
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [rentings, setRentings] = useState([]);
  const [loading, setLoading] = useState(false);
  const colRef = collection(db, "rentings");
  const [user, setUser] = useState();

  useEffect(() => {
    onSnapshot(colRef, (snapshot) => {
      let rentings = [];
      snapshot.forEach((doc) => {
        rentings.push(doc);
      });

      setRentings(rentings);
    });
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSignOut = () => {
    swal({
      title: "Är du säker?",
      text: "När du loggar ut kommer du inte kunna ändra dina bokningar längre!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal("Du är nu utloggad!", {
          icon: "success",
        });
        signOut(auth)
          .then(() => {
            setUser(null);
          })
          .catch((error) => {
            console.log("error", error);
          });
      } else {
        swal("Du är kvar inloggad!");
      }
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    swal({
      title: "Är du säker?",
      text: `Ett bokning kommer att skapas mellan ${form.fromDate} och ${form.toDate}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal("Bokningen är tillagd", {
          icon: "success",
        });
        addDoc(colRef, {
          name: form.name,
          email: form.email,
          fromDate: form.fromDate,
          toDate: form.toDate,
          option: form.option,
          phoneNumber: form.phoneNumber,
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
      } else {
        swal("Bokningen är inte tillagd!");
      }
    });
  };

  const handleDelete = (e) => {
    swal({
      title: "Är du säker?",
      text: "När du tar bort din bokning så kommer den inte längre att synas på kalendern!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal("Bokningen är nu borta!", {
          icon: "success",
        });
        const docRef = doc(db, "rentings", e.target.id);
        deleteDoc(docRef);
      } else {
        swal("Bokningen är kvar!");
      }
    });
  };

  return (
    <>
      {user && (
        <div className="max-w-7xl mx-auto mt-12 md:my-20 pb-10">
          <div className="flex h-20 justify-center items-center">
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-block rounded-lg bg-red-500 px-5 py-3 text-sm font-medium text-white"
            >
              Logga ut
            </button>
          </div>
          <div className="grid sm:grid-cols-2">
            <CustomCalendar floor={"both"} form={form} setForm={setForm} />
            <section className="sm:p-14 gap-10 grid h-fit mt-10">
              <div>
                <h2 className="flex-auto flex items-center gap-4 mb-2 text-xl font-semibold text-gray-900">
                  Alla bokningar
                  <MdDateRange className="h-full" />
                </h2>
                {rentings.map((renting) => {
                  return (
                    <div key={renting.id}>
                      <BookingItem
                        renting={renting}
                        handleDelete={handleDelete}
                      />
                    </div>
                  );
                })}
              </div>
              <div>
                <h2 className="flex-auto mb-2 text-xl font-semibold text-gray-900">
                  Lägg till Bokning
                </h2>
                <div className="w-20 h-1 mb-5 bg-indigo-600 rounded-full"></div>
                <div className="pt-5 grid px-3">
                  <form
                    onSubmit={handleAdd}
                    id="form"
                    className="gap-9 flex flex-col px-3"
                  >
                    <div className="sm:grid-cols-1 grid grid-cols-1 gap-4 text-center">
                      <div>
                        <input
                          className="peer sr-only"
                          id="option1"
                          type="radio"
                          tabIndex={-1}
                          name="option"
                          value="both"
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="option1"
                          className="hover:border-indigo-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white block w-full p-3 border border-gray-200 rounded-lg"
                          tabIndex={0}
                        >
                          <span className="text-sm font-medium">
                            Båda Lägenheterna
                          </span>
                        </label>
                      </div>

                      <div>
                        <input
                          className="peer sr-only"
                          id="option2"
                          type="radio"
                          tabIndex={-1}
                          name="option"
                          value="bottom"
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="option2"
                          className="hover:border-indigo-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white block w-full p-3 border border-gray-200 rounded-lg"
                          tabIndex={0}
                        >
                          <span className="text-sm font-medium">
                            Bottenvåning
                          </span>
                        </label>
                      </div>

                      <div>
                        <input
                          className="peer sr-only"
                          id="option3"
                          type="radio"
                          tabIndex={-1}
                          name="option"
                          value="top"
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="option3"
                          className="hover:border-indigo-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white block w-full p-3 border border-gray-200 rounded-lg"
                          tabIndex={0}
                        >
                          <span className="text-sm font-medium">
                            Övervåning
                          </span>
                        </label>
                      </div>
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
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        title="don't include capital letters: characters@characters.domain"
                        className="peer focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm w-full h-8 p-0 placeholder-transparent bg-transparent border-none"
                        required
                      />
                      <span className="top-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs absolute left-0 text-xs text-gray-700 transition-all -translate-y-1/2">
                        Kundens Email
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
                        maxLength={100}
                        pattern="^(\w\w+)\s(\w+)$"
                        title="firstName LastName"
                        onChange={handleChange}
                        className="peer focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm w-full h-8 p-0 placeholder-transparent bg-transparent border-none"
                        required
                      />
                      <span className="top-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs absolute left-0 text-xs text-gray-700 transition-all -translate-y-1/2">
                        Förnamn och efternamn
                      </span>
                    </label>
                    <label
                      htmlFor="phoneNumber"
                      className="focus-within:border-indigo-600 relative block pt-3 overflow-hidden border-b border-gray-200"
                    >
                      <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        placeholder="Telefonnummer"
                        maxLength={100}
                        pattern="^[0-9]+$"
                        title="Telefonnummer utan mellanslag eller bindestreck: 0701234567"
                        onChange={handleChange}
                        className="peer focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm w-full h-8 p-0 placeholder-transparent bg-transparent border-none"
                        required
                      />
                      <span className="top-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs absolute left-0 text-xs text-gray-700 transition-all -translate-y-1/2">
                        Telefonnummer
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
                          required
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
                          required
                        />
                        <span className="top-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs absolute left-0 text-xs text-gray-700 transition-all -translate-y-1/2">
                          Till
                        </span>
                      </label>
                    </div>
                    <button className="bg-indigo-600 text-lg text-white py-2.5 px-6 rounded-lg hover:bg-indigo-800 w-fit">
                      {loading === true
                        ? "Lägger till bokning..."
                        : "Lägg till bokningen"}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default AddRentings;
