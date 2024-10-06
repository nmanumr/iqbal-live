import {useLoaderData} from "react-router-dom";
import {createContext, PropsWithChildren, useContext, useEffect, useRef, useState} from "react";
import clsx from "clsx";

export default function Poem() {
  const poem = useLoaderData() as Element;

  return (
    <div
      className="text-center font-nastaliq leading-[2] py-10"
      dir="rtl"
    >
      <div dir="rtl" className="text-center leading-[2] font-nastaliq mb-10">
        <div dir="rtl">
          {poem?.getAttribute("BookName")} &gt;{" "}
          {poem?.getAttribute("SectionName")}
        </div>
        <div className="text-4xl mt-4 leading-[2]">{poem?.getAttribute("Name")}</div>
      </div>

      <SizeProvider>
        {poem && <Verses poem={poem}/>}
      </SizeProvider>
    </div>
  );
}

const SizeContext = createContext<{
  setChildSize: (size: number) => void,
  maxSize: number | undefined
} | null>(null)

function Verses({poem}: { poem: Element }) {
  return (
    <div className="flex flex-col items-center justify-center @container">
      {Array.from(poem?.children ?? []).map((para) => (
        <SizeProvider>
          <div className="leading-[2.2] text-xl font-nastaliq para @5xl:grid py-4 gap-x-10" dir="rtl">
            {Array.from(para?.children ?? []).map((verse) => {
              const originalTextNode = Array.from(verse.children ?? []).find(
                (node) => node.getAttribute("Language") === "Original"
              );
              const originalText = originalTextNode?.textContent;
              const verses = originalText?.split("\n");

              return verses
                ?.map((v) => v.trim())
                ?.filter(Boolean)
                ?.map((ver) => (
                  <div className="even:mb-4 flex justify-center">
                    <Verse content={ver}/>
                  </div>
                ));
            })}
          </div>
        </SizeProvider>
      ))}
    </div>
  )
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
        "py-1 inline-block w-fit",
        sizeContext?.maxSize && "flex justify-between"
      )}
    >
      {
        content
          .split(" ")
          .filter(Boolean)
          .map((word) => (
            <div className="inline-block px-1">
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

