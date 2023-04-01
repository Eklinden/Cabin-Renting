import { MdDateRange } from "react-icons/md/index.js";

const BookingItem = ({ renting, handleDelete }) => {
  const { fromDate, toDate } = renting.data();
  return (
    <article
      key={renting.id}
      className="border-b-2 flex justify-between content-center mt-4 gap-3"
    >
      <div className="flex flex-wrap items-center justify-between flex-grow gap-1">
        <section>
          <p className="font-bold muted"></p>
          <p className=" flex gap-2">
            <span>
              <MdDateRange className="h-full" />
            </span>
            {`${fromDate} - ${toDate}`}
          </p>
        </section>
        <section className="flex flex-wrap content-center">
          <p></p>
        </section>
      </div>
      <section className="flex flex-grow items-start justify-end">
        <button
          onClick={handleDelete}
          id={renting.id}
          className="rounded-xl border mx-auto border-RPDarkRed my-3 py-1 px-5  text-l bg-red-500 text-white hover:bg-RPDarkRed hover:border-RPRed"
        >
          Ta bort bokning
        </button>
      </section>
    </article>
  );
};

export default BookingItem;
