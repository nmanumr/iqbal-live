import Poem from "./components/Poem";

function App() {
  return (
    <div className="py-10">
      <Poem bookId="01" sectionId="1a" poemId="01" />
      {/* <Para
        verses={[
          `اے ہمالہ! اے فصیل کشور ہندوستاں`,
          `چومتا ہے تیری پیشانی کو جھک کر آسماں`,
        ]}
      /> */}
    </div>
  );
}

export default App;
