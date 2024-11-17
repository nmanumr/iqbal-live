import {useLoaderData} from "react-router-dom";
import {createContext, PropsWithChildren, useContext, useEffect, useRef, useState} from "react";
import clsx from "clsx";

export default function Poem() {
  const poem = useLoaderData() as Element;

  return (
    <div
      className="text-center font-nastaliq leading-[2] py-10 px-4 sm:px-6 md:px-4 lg:px-12"
      dir="rtl"
    >
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
              <Stanza para={para}/>
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
} | null>(null)

function Stanza({para}: { para: Element }) {
  const stanzaTitle = para.getAttribute('Name');

  return (
    <>
      {stanzaTitle && <div className="text-2xl my-4 text-start">{stanzaTitle}</div>}

      {Array.from(para?.children ?? []).map((couplet) => {
        const originalText = Array.from(couplet.children ?? []).find(
          (node) => node.getAttribute("Language") === 'Original'
        )?.textContent?.split('\n').map((v) => v?.trim()).filter(Boolean);

        const urduText = Array.from(couplet.children ?? []).find(
          (node) => node.getAttribute("Language") === 'Urdu'
        )?.textContent;
        const englishText = Array.from(couplet.children ?? []).find(
          (node) => node.getAttribute("Language") === 'English'
        )?.textContent;

        const id = couplet.getAttribute('ID');

        return (
          <SizeProvider>
            <div
              className="relative py-2 space-y-4 px-4 max-w-5xl w-full border-b border-black/10 lg:grid grid-cols-2 gap-x-10"
              id={`cplt${id}`}
              key={id}
            >
              {id && (
                <a href={`#cplt${id}`}
                   className="font-black font-sans text-xl text-gray-200 absolute start-0 inset-y-0 flex items-center hover:text-gray-400 transition">
                  {id}
                </a>
              )}
              <div className="ps-8">
                {originalText?.map((verse) => (
                  <div className="flex justify-center">
                    <Verse content={verse}/>
                  </div>
                ))}
              </div>

              <div className="lg:block space-y-4 text-center">
                <div className="leading-[2] font-nastaliq text-lg text-center" dir="rtl">{urduText}</div>
                <div className="font-nastaliq text-center text-sm" dir="ltr">{englishText}</div>
              </div>
            </div>
          </SizeProvider>
        );
      })}
    </>
  );
}

function Verse({content}: { content: string }) {
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
      style={{minWidth: sizeContext?.maxSize ? `${sizeContext?.maxSize}px` : undefined}}
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
  )

}

function SizeProvider({children}: PropsWithChildren<{}>) {
  const [maxSize, setMaxSize] = useState<number>();

  return (
    <SizeContext.Provider
      value={{
        maxSize,
        setChildSize: (size) => {
          console.log()
          setMaxSize((s) => Math.max(s ?? 0, size));
        }
      }}
    >
      {children}
    </SizeContext.Provider>
  )
}

