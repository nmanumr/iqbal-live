import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  index("./pages/home.tsx"),
  route(":bookId", "./pages/book.tsx"),
  route(":bookId/:sectionId/:poemId", "./pages/poem.tsx"),
] satisfies RouteConfig;
