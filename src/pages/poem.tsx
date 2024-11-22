import { ClientLoaderFunctionArgs } from "react-router";
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import clsx from "clsx";

export async function clientLoader({ params: { bookId, sectionId, poemId } }: ClientLoaderFunctionArgs) {
  const content = await fetch(`/content/${bookId}/${sectionId}/${poemId}/${poemId}.xml`).then((response) => response.text());

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/xml");
  return doc.documentElement;
}

clientLoader.hydrate = true as const;


export default function Poem({ loaderData: poem }: { loaderData: Awaited<ReturnType<typeof clientLoader>> }) {
  const [urTrans, setUrTrans] = useState(true);
  const [enTrans, setEnTrans] = useState(true);

  return (
    <div
      className="text-center font-nastaliq leading-[2] py-10 px-4 sm:px-6 md:px-4 lg:px-12"
      dir="rtl"
    >
      <div dir="ltr" className="flex items-center gap-x-4 max-w-fit">
        <div>
          <div>Translation:</div>
        </div>
        <div className="flex items-center gap-x-2">
          <input className="relative -top-0.5" onChange={() => setEnTrans((v) => !v)} checked={enTrans}
                 type="checkbox"
                 id="show-en-translation" />
          <label htmlFor="show-en-translation">English</label>
        </div>
        <div className="flex items-center gap-x-2">
          <input className="relative -top-0.5" onChange={() => setUrTrans((v) => !v)} checked={urTrans}
                 type="checkbox"
                 id="show-ur-translation" />
          <label htmlFor="show-ur-translation">Urdu</label>
        </div>
      </div>

      <div dir="rtl" className="text-center leading-[2] font-nastaliq mb-10">
        <div dir="rtl">
          {poem?.getAttribute("BookName")} &gt;{" "}
          {poem?.getAttribute("SectionName")}
        </div>
        <div className="text-4xl mt-4 leading-[2]">{poem?.getAttribute("Name")}</div>
      </div>

      {poem && (
        <div className="flex flex-col items-center justify-center @container leading-[2.2] text-2xl font-nastaliq">
          {Array.from(poem?.children ?? []).map((para) => (
            <SizeProvider>
              <Stanza urTrans={urTrans} enTrans={enTrans} para={para} />
            </SizeProvider>
          ))}
        </div>
      )}
    </div>
  );
}

const SizeContext = createContext<{
  setChildSize: (size: number) => void,
  maxSize: number | undefined
} | null>(null);

function Stanza({ para, urTrans, enTrans }: { para: Element, urTrans: boolean, enTrans: boolean }) {
  const stanzaTitle = para.getAttribute("Name");

  return (
    <>
      {stanzaTitle && <div className="text-2xl my-4 text-start">{stanzaTitle}</div>}

      {Array.from(para?.children ?? []).map((couplet) => {
        const originalText = Array.from(couplet.children ?? []).find(
          (node) => node.getAttribute("Language") === "Original"
        )?.textContent?.split("\n").map((v) => v?.trim()).filter(Boolean);

        const urduText = Array.from(couplet.children ?? []).find(
          (node) => node.getAttribute("Language") === "Urdu"
        )?.textContent;
        const englishText = Array.from(couplet.children ?? []).find(
          (node) => node.getAttribute("Language") === "English"
        )?.textContent;

        const id = couplet.getAttribute("ID");

        return (
          <SizeProvider>
            <div
              className={clsx(
                "relative py-2 px-4 max-w-6xl w-full border-b border-black/10",
                (urTrans || enTrans) && "lg:grid grid-cols-5 lg:gap-x-10"
              )}
              id={`cplt${id}`}
              key={id}
            >
              <div className="ps-8 relative col-span-2 flex flex-col justify-center">
                {id && (
                  <a href={`#cplt${id}`}
                     className="font-black font-sans text-xl text-gray-200 absolute start-0 inset-y-0 flex items-center hover:text-gray-400 transition">
                    {id}
                  </a>
                )}
                {originalText?.map((verse) => (
                  <div className="flex justify-center">
                    <Verse content={verse} />
                  </div>
                ))}
              </div>

              {(urTrans || enTrans) &&
                <div className="lg:flex gap-y-0.5 text-center mt-4 lg:mt-0 col-span-3 flex-col justify-center">
                  {urTrans && (
                    <div className="leading-[2] font-nastaliq text-xl text-center" dir="rtl">{urduText}</div>)}
                  {enTrans && (<div className="font-nastaliq text-center text-sm" dir="ltr">{englishText}</div>)}
                </div>}
            </div>
          </SizeProvider>
        );
      })}
    </>
  );
}

function Verse({ content }: { content: string }) {
  const verseRef = useRef<HTMLDivElement>(null);
  const sizeContext = useContext(SizeContext);

  useEffect(() => {
    if (verseRef.current?.clientWidth && sizeContext?.setChildSize) {
      sizeContext.setChildSize(verseRef.current?.clientWidth);
    }
  }, []);

  return (
    <div
      ref={verseRef}
      style={{ minWidth: sizeContext?.maxSize ? `${sizeContext?.maxSize}px` : undefined }}
      className={clsx(
        "inline-block w-fit leading-[1.8]",
        sizeContext?.maxSize && "flex justify-between"
      )}
    >
      {
        content
          .split(" ")
          .filter(Boolean)
          .map((word) => (
            <div className="inline-block px-0.5">
              {word}&nbsp;
            </div>
          ))
      }
    </div>
  );

}

function SizeProvider({ children }: PropsWithChildren<{}>) {
  const [maxSize, setMaxSize] = useState<number>();

  return (
    <SizeContext.Provider
      value={{
        maxSize,
        setChildSize: (size) => {
          console.log();
          setMaxSize((s) => Math.max(s ?? 0, size));
        }
      }}
    >
      {children}
    </SizeContext.Provider>
  );
}

