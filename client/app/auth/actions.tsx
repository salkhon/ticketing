"use server"; // server actions
import { revalidateTag } from "next/cache";

export default async function revalidateCurrentUserTag() {
	revalidateTag("currentuser");
}
