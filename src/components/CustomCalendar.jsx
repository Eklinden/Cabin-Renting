import {
  add,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  getWeek,
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
        if (doc.data().option === floor || doc.data().option === "both") {
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
    <div className="p-2 sm:p-14 mx-auto border-b-2 pb-5 md:border-b-0">
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
      <div className="relative overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 flex justify-between gap-6">
        <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

        <div>
          <div className="sm:flex sm:justify-between sm:gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                {format(selectedDay, "EEEE, d MMMM", { locale: sv })}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <p className="max-w-[40ch] text-sm text-gray-500">
              {floor === "bottom" && "Nedre Lägenheten"}
              {floor === "top" && "Övre Lägenheten"}
              {floor === "both" && "Båda Lägenheterna"}
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse flex-1">
          <dt className="text-base font-medium text-gray-600 text-right">
            <span className="text-green-600">
              {prices[getWeek(selectedDay)]}
            </span>{" "}
            kr / vecka
          </dt>
          <dd className="text-xs text-gray-500 text-right">
            Pris baserat på EN lägenhet
          </dd>
        </div>
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
let prices = [
  "9000",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "14000",
  "14000",
  "14000",
  "9000",
  "9000",
  "9000",
  "9000",
  "14000",
  "14000",
  "9000",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "9000",
  "9000",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "5500",
  "9000",
  "9000",
  "9000",
  "14000",
  "14000",
];
export default CustomCalendar;
