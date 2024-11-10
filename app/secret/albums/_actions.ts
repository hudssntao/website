"use server";

import { cookies } from "next/headers";

export async function setSeenPopupCookie() {
	const cookieStore = cookies();

	cookieStore.set("hasSeenPopup", "true");
}
