import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
	const sig = req.headers.get("stripe-signature");
	const body = await req.text();
	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(
			body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET
		);
		if (event.type === "checkout.session.completed") {
			const session = event.data.object;
			const transaction = await prisma.transaction.create({
				data: {
					sessionId: session.id,
					amount: session.amount_total!,
					customerId: session.customer?.toString()!,
					invoiceId: session.invoice?.toString()!,
					subscriprionId: session.subscription?.toString()!,
					mode: session.mode,
					paymentStatus: session.payment_status,
					status: session.status!,
					email: session.customer_email!,
				},
			});
			if (transaction) {
				return NextResponse.json("Checkout session completed", {
					status: 200,
				});
			}
		}
	} catch (error) {}
	return NextResponse.json({ received: true });
}
