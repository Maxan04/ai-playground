import { redirect } from "react-router";

export async function loader() {
    return redirect("/playground");
}

export default function IndexRoute() {
    return null;
}