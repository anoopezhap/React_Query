import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

const POSTS = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
];

//wait(1000).then(() => [...POSTS])

//Promise.reject("Error Message")

//Query Key Examples

// /posts ==> ["posts"]
// /posts/1 ==> ["posts, post.id"]
// /posts?user=1 ==> ["posts",{authorId:1}]
// /posts/1/coomments ==> ["posts",post.id,"comments"]

function App() {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: (obj) =>
      wait(3000).then(() => {
        console.log(obj);
        //return [...POSTS];

        throw new Error("Somethng happened");
      }),
  });

  const newPostMutation = useMutation({
    mutationFn: (title) =>
      wait(1000).then(() => POSTS.push({ id: crypto.randomUUID(), title })),
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
  });

  if (postsQuery.isLoading) return <h1>isloading</h1>;
  if (postsQuery.isError) return <h1>{postsQuery?.error.message}</h1>;

  return (
    <div>
      {postsQuery.data.map((post) => (
        <div key={post.id}> {post.title}</div>
      ))}

      <button
        disabled={newPostMutation.isLoading}
        onClick={() => newPostMutation.mutate("New Post")}
      >
        Add New Post
      </button>
    </div>
  );
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
