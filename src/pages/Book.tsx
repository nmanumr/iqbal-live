import {Link, useLoaderData} from "react-router-dom";

export default function Book() {
  const book = useLoaderData() as any;
  if (!book) {
    return <div>Not found</div>;
  }

  return (
    <div
      className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-4xl lg:px-12 py-10 text-center font-nastaliq leading-[2]"
      dir="rtl"
    >
      <div className="text-4xl mb-10">{book.name}</div>
      {book.sections.map((section: any) => (
        <section key={section.id}>
          <div className="text-2xl py-4 sticky top-0 bg-white border-b border-gray-200">{section.name}</div>

          {section.poems.map((poem: any) => (
            <Link key={poem.id} to={`/${book.id}/${section.id}/${poem.id}`} className="block py-3 px-4 text-lg leading-[2] text-start">
              {poem.name}
            </Link>
          ))}
        </section>
      ))}

    </div>
  )
}