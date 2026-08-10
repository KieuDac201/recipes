import RecipeListing from "./components/RecipeListing";

export const metadata = {
  title: "GourmetPop — Discover Recipes",
  description: "Find and cook vibrant, delicious recipes. Search by category, browse trending dishes.",
};

export default function Home() {
  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-16">
      <RecipeListing />
    </main>
  );
}
