import { client } from "@/sanity/lib/client";
import SearchForm from "../../components/SearchForm";
import StartupCard from "../../components/StartupCard";
import { STARTUPS_QUERY } from "@/lib/queries";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const posts = await client.fetch(STARTUPS_QUERY);

  console.log(JSON.stringify(posts, null, 2));

  /* const posts = [
    {
      _createdAt: new Date(),
      views: 55,
      author: { name: "mohammed", _id: 1 },
      _id: 1,
      image:
        "https://images.unsplash.com/photo-1634912314704-c646c586b131?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Robots",
      title: "We Robots",
      description: "this is a description",
    },
  ]; */

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br />
          Connect With Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions
        </p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search Result For "${query}"` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts.length > 0 ? (
            posts.map((post: StartupCardType, index: number) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <>
              <p className="no-result">No Startups Found</p>
              <p>test</p>
            </>
          )}
        </ul>
      </section>
    </>
  );
}
