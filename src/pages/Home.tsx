import {Link, useLoaderData} from "react-router-dom";

export default function Home() {
  const data = useLoaderData() as Array<any>;

  return (
    <div
      className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-4xl lg:px-12 py-10 font-nastaliq leading-[2]"
      dir="rtl"
    >
      {data.map((book) => (
        <Link className="block py-2" key={book.id} to={`/${book.id}`}>
          {book.name}
        </Link>
      ))}
    </div>
  )
}