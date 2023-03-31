import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isEqual,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { sv } from "date-fns/locale";
import { useState, useEffect } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CustomCalendar = () => {
  let today = startOfDay(new Date());
  let [selectedDay, setSelectedDay] = useState(new Date());

  let newDays = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  useEffect(() => {
    console.log("selectedDay", selectedDay);
  }, [selectedDay]);

  return (
    <div className="sm:px-7 md:max-w-4xl md:px-6 max-w-md px-4 mx-auto">
      <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
        <div className="md:pr-14">
          <div className="flex items-center">
            <h2 className="flex-auto font-semibold text-gray-900">
              {format(today, "MMMM yyyy", { locale: sv })}
            </h2>
            <button
              type="button"
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Förgående månad</span>
            </button>
            <button
              type="button"
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Nästa månad</span>
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
            {newDays.map((day, dayidx) => {
              return (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayidx > 6 && "border-t border-gray-200 py-2"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={classNames(
                      isEqual(day, selectedDay) && "text-white",
                      !isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "text-indigo-600",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, today) &&
                        "text-gray-900",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, today) &&
                        "text-gray-400",
                      isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "bg-indigo-600",
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-gray-900",
                      !isEqual(day, selectedDay) && "hover:bg-gray-200",
                      (isToday(day) || isEqual(day, selectedDay)) &&
                        "font-semibold",
                      "mx-auto w-12 h-10 rounded-full flex items-center justify-center"
                    )}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>
                      {format(day, "d", { locale: sv })}
                    </time>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
