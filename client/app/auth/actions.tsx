"use server";
import { revalidateTag } from "next/cache";

export default async function currentUserRevalidate() {
	revalidateTag("currentuser");
	return {};
}
