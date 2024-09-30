import { auth } from "@/auth";
import { prisma } from "@/prisma/db";

interface CheckoutSessionResponse {
	url?: string;
	error?: string;
}
export const createCheckoutSession = async (
	req: Request,
	res: Response
): Promise<CheckoutSessionResponse> => {
	const session = await auth();
	if (!session?.user?.email) {
		return {
			error: "User not found",
		};
	}
	try {
		const existingUser = await prisma.transaction.findFirst({
			where: {
				email: session.user.email,
			},
		});
	} catch (error) {}
};
