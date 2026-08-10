import RecipeListing from "../components/RecipeListing";

export const metadata = {
  title: "GourmetPop — Khám Phá Công Thức Nấu Ăn",
  description: "Tìm kiếm và nấu những món ăn thơm ngon, hấp dẫn. Duyệt theo danh mục, khám phá các món ăn thịnh hành.",
};

export default function Home() {
  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-16">
      <RecipeListing />
    </main>
  );
}
