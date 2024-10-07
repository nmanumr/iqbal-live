import {useRef, useState} from "react";
import {Link, useLoaderData} from "react-router-dom";

import {ChevronLeftIcon} from '@heroicons/react/24/outline'
import Fuse from "fuse.js";

import IndexType from '../../public/index.json';


export default function Home() {
  const indexItems = useLoaderData() as typeof IndexType;

  const fuseRef = useRef(new Fuse(flattenIndex(indexItems), {
    threshold: 0.4,
    keys: [
      'name',
      'nameEn',
      'year'
    ]
  }));

  const [searchValue, setSearchValue] = useState('');
  const searchResults = searchValue ? fuseRef.current.search(searchValue).slice(0, 20) : [];

  return (
    <div
      className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-4xl lg:px-12 py-10 font-nastaliq leading-[2]"
      dir="rtl"
    >
      <div className="text-center text-4xl leading-[2]">کلیات اقبال</div>

      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="mt-6 mb-10 border-gray-200 w-full text-center py-2 text-lg rounded bg-gray-50"
        type="search"
        placeholder="...Search"
      />

      <div className="divide-y divide-gray-200">
        {searchResults?.map((searchResult) => {
          const bookName = (searchResult.item).bookName;
          const sectionName = (searchResult.item).sectionName;
          const to = [
            searchResult.item.bookId,
            searchResult.item.sectionId,
            searchResult.item.id,
          ]
            .filter(Boolean)
            .join('/');

          return (
            <Link
              to={'/' + to}
              className="py-6 px-4 block text-xl leading-[2] hover:bg-gray-50 transition"
              key={to}
            >
              {(bookName || sectionName) && (
                <div className="text-lg mb-2 text-gray-500 flex items-center gap-3">
                  <span>{bookName}</span>
                  {sectionName && (
                    <>
                      <ChevronLeftIcon className="size-3" strokeWidth={3}/>
                      <span>{sectionName}</span>
                    </>
                  )}
                </div>
              )}
              <div>{searchResult.item.name}</div>
            </Link>
          );
        })}

        {searchValue && !searchResults.length && (
          <div className="text-center">
            No Result Found
          </div>
        )}
      </div>

      {!searchValue && indexItems.map((book) => (
        <Link className="block py-4 text-xl leading-[2] text-center" key={book.id} to={`/${book.id}`}>
          {book.name}
        </Link>
      ))}
    </div>
  )
}

function flattenIndex(index: any[]) {
  const books = index.map((book) => ({
    type: 'book',
    id: book.id,
    name: book.name,
    nameEn: book['name-en'],
    year: book.year,
  }));

  const sectionsWithBookName = index.flatMap((book) => book.sections.map((s) => ({
    ...s,
    bookId: book.id,
    bookName: book.name,
    bookNameEn: book['name-en'],
  })));

  const poemsWithSectionName = sectionsWithBookName.flatMap((section) => section.poems.map((p) => ({
    ...p,
    bookName: section.bookName,
    bookNameEn: section.bookNameEn,
    sectionId: section.id,
    bookId: section.bookId,
    sectionName: section.name,
    sectionNameEn: section['name-en'],
  })))

  const sections = sectionsWithBookName
    .filter((e) => !!e['name-en'])
    .map((section) => ({
      id: section.id,
      type: 'section',
      name: section.name,
      nameEn: section['name-en'],
      bookId: section.bookId,
      bookName: section.bookName,
      bookNameEn: section.bookNameEn,
    }));

  const poems = poemsWithSectionName
    .filter((e) => !!e['name-en'])
    .map((poem) => ({
      id: poem.id,
      type: 'poem',
      name: poem.name,
      nameEn: poem['name-en'],
      bookId: poem.bookId,
      bookName: poem.bookName,
      bookNameEn: poem.bookNameEn,
      sectionId: poem.sectionId,
      sectionName: poem.sectionName,
      sectionNameEn: poem.sectionNameEn,
    }));

  return [
    ...books,
    ...sections,
    ...poems,
  ] as {
    type: 'poem' | 'book' | 'section',
    id: string,
    name: string,
    nameEn?: string,
    bookId?: string,
    bookName?: string,
    bookNameEn?: string,
    sectionId?: string,
    sectionName?: string,
    sectionNameEn?: string,
  }[]
}
