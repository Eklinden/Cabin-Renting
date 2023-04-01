import {
  add,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfDay,
} from "date-fns";
import { sv } from "date-fns/locale/index.js";
import { useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi/index.js";
import { db, auth } from "../../FirebaseService";
import { collection, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const today = startOfDay(new Date());
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CustomCalendar = ({ form, setForm, floor }) => {
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [rentings, setRentings] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  let firstDayOfCurrentMonth = parse(currentMonth, "MMM-yyyy", today);

  let days = eachDayOfInterval({
    start: firstDayOfCurrentMonth,
    end: endOfMonth(firstDayOfCurrentMonth),
  });

  function nextMonth() {
    let firstDayOfNextMonth = add(firstDayOfCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
  }
  function previousMonth() {
    let firstDayOfNextMonth = add(firstDayOfCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
  }

  useEffect(() => {
    const colRef = collection(db, "rentings");
    onSnapshot(colRef, (snapshot) => {
      let rentings = [];
      snapshot.forEach((doc) => {
        if (doc.data().floor === floor || floor === "both") {
          rentings.push(
            ...eachDayOfInterval({
              start: new Date(doc.data().fromDate),
              end: new Date(doc.data().toDate),
            })
          );
        } else if (doc.data().floor === "both") {
          rentings.push(
            ...eachDayOfInterval({
              start: new Date(doc.data().fromDate),
              end: new Date(doc.data().toDate),
            })
          );
        }
      });
      setRentings(rentings);
    });
  }, []);
  return (
    <div className="sm:p-14 mx-auto">
      {floor === "both" && (
        <>
          {user === null && (
            <>
              <h2 className="flex-auto mb-2 text-xl font-semibold text-gray-900">
                Kalender för att hyra båda Lägenheterna
              </h2>
              <div className="flex flex-wrap mb-5">
                <div className="flex-grow">
                  <a
                    href="/topApartment"
                    className="hover:text-indigo-800 text-indigo-500"
                  >
                    Till övre Lägenheten
                  </a>
                  <div className="w-20 h-1 mb-5 bg-indigo-600 rounded-full"></div>
                </div>
                <div className="flex-grow">
                  <a
                    href="/bottomApartment"
                    className="hover:text-indigo-800 text-indigo-500"
                  >
                    Till nedre Lägenheten
                  </a>
                  <div className="w-20 h-1 mb-5 bg-indigo-600 rounded-full"></div>
                </div>
              </div>
            </>
          )}
          {user && (
            <h2 className="flex-auto mb-2 text-xl font-semibold text-gray-900">
              Kalender för alla uthyrningar
            </h2>
          )}
        </>
      )}
      {floor === "bottom" && user && <h2>Kalender över alla månader</h2>}
      {floor === "bottom" && (
        <>
          <h2 className="flex-auto mb-2 text-xl font-semibold text-gray-900">
            Kalender för att hyra nedre Lägenheten
          </h2>
          <div className="w-20 h-1 mb-5 bg-indigo-600 rounded-full"></div>
        </>
      )}
      {floor === "top" && (
        <>
          <h2 className="flex-auto mb-2 text-xl font-semibold text-gray-900">
            Kalender för att hyra övre Lägenheten
          </h2>
          <div className="w-20 h-1 mb-5 bg-indigo-600 rounded-full"></div>
        </>
      )}
      <div className="flex items-center">
        <h3 className="flex-auto text-xl font-semibold text-gray-900">
          {format(firstDayOfCurrentMonth, "MMMM yyyy", { locale: sv })}
        </h3>
        <button
          type="button"
          onClick={previousMonth}
          className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Förgående månad</span>
          <BiChevronLeft fontSize={28} />
        </button>
        <button
          type="button"
          onClick={nextMonth}
          className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Nästa månad</span>
          <BiChevronRight fontSize={28} />
        </button>
      </div>
      <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
        <div>S</div>
      </div>
      <div className="grid grid-cols-7 mt-2 text-sm">
        {days.map((day, dayidx) => {
          return (
            <div
              key={day.toString()}
              className={classNames(
                dayidx > 6 && " border-gray-200 px-4 py-4",
                dayidx === 0 && colStartClasses[getDay(day)],
                "py-4 px-4"
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedDay(day);
                  setForm({
                    ...form,
                    fromDate: format(day, "yyyy-MM-dd"),
                    toDate: format(new Date(addWeeks(day, 1)), "yyyy-MM-dd"),
                  });
                }}
                className={classNames(
                  isEqual(day, selectedDay) && "text-white",
                  !isEqual(day, selectedDay) &&
                    isToday(day) &&
                    "text-indigo-600",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayOfCurrentMonth) &&
                    "text-gray-900",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayOfCurrentMonth) &&
                    "text-gray-400",
                  isEqual(day, selectedDay) && isToday(day) && "bg-indigo-600",
                  isEqual(day, selectedDay) && !isToday(day) && "bg-gray-700",
                  !isEqual(day, selectedDay) && "hover:bg-gray-200",
                  (isToday(day) || isEqual(day, selectedDay)) &&
                    "font-semibold",
                  "mx-auto w-8  h-8 p-2 rounded-full flex items-center justify-center"
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d", { locale: sv })}
                </time>
              </button>
              {rentings.some((renting) => isSameDay(renting, day)) && (
                <div className={"w-full h-1 mx-auto mt-2 bg-red-600"}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
let colStartClasses = [
  "col-start-1",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
export default CustomCalendar;
