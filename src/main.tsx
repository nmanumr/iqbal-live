import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'

import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Book from "./pages/Book.tsx";
import Poem from "./pages/Poem.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    loader: () => fetch(`/index.json`).then((r) => r.json()),
  },
  {
    path: "/:bookId",
    element: <Book/>,
    loader: ({params}) => fetch(`/index.json`)
      .then((r) => r.json())
      .then((books) => books.find((b: any) => b.id == params.bookId)),
  },
  {
    path: "/:bookId/:sectionId/:poemId",
    element: <Poem/>,
    loader: ({params: {bookId, sectionId, poemId}}) =>
      fetch(`/content/${bookId}/${sectionId}/${poemId}/${poemId}.xml`)
        .then((response) => response.text())
        .then((text) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "text/xml");
          return doc.documentElement
        }),
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
