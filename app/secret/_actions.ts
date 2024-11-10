'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function validateSecret(secret: string) {
	const cookieStore = cookies();

	const secretIsValid = secret === process.env.SECRET_PASSWORD;
	if (secretIsValid) {
		cookieStore.set("valid", "true", { secure: true });
		redirect("/secret/albums");
	}

	return secretIsValid
}
