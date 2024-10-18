// app/routes/index.tsx
import { redirect, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Task manager mvp" },
    { name: "description", content: "Welcome!" },
  ];
};


export const loader = () => {
  return redirect("/tasks");
};

export default function Index() {
  return null;
}
