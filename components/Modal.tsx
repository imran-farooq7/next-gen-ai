("");
import { Fragment, useContext, useState } from "react";
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CountContext } from "@/providers/UsageProvider";

export default function Modal() {
	const ctx = useContext(CountContext);
	return (
		<Transition show={ctx?.openModal}>
			<Dialog className="relative z-10" onClose={ctx?.setOpenModal!}>
				<TransitionChild
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="hidden sm:fixed sm:inset-0 sm:block sm:bg-gray-500 sm:bg-opacity-75 sm:transition-opacity" />
				</TransitionChild>

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-stretch justify-center text-center sm:items-center sm:px-6 lg:px-8">
						<TransitionChild
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-105"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-105"
						>
							<DialogPanel className="flex w-full max-w-3xl transform text-left text-base transition sm:my-8">
								<form className="relative flex w-full flex-col overflow-hidden bg-white pb-8 pt-6 sm:rounded-lg sm:pb-6 lg:py-8">
									<div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
										<h2 className="text-lg font-medium text-gray-900">
											Shopping Cart
										</h2>
										<button
											type="button"
											className="text-gray-400 hover:text-gray-500"
											onClick={() => ctx?.setOpenModal(false)}
										>
											<span className="sr-only">Close</span>
											<XMarkIcon className="h-6 w-6" aria-hidden="true" />
										</button>
									</div>

									<section aria-labelledby="cart-heading">
										<h2 id="cart-heading" className="sr-only">
											Items in your shopping cart
										</h2>
									</section>

									<section
										aria-labelledby="summary-heading"
										className="mt-auto sm:px-6 lg:px-8"
									>
										<div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
											<h2 id="summary-heading" className="sr-only">
												Order summary
											</h2>

											<div className="flow-root">
												<dl className="-my-4 divide-y divide-gray-200 text-sm">
													<div className="flex items-center justify-between py-4">
														<dt className="text-gray-600">Subtotal</dt>
														<dd className="font-medium text-gray-900">
															$262.00
														</dd>
													</div>
													<div className="flex items-center justify-between py-4">
														<dt className="text-gray-600">Shipping</dt>
														<dd className="font-medium text-gray-900">$5.00</dd>
													</div>
													<div className="flex items-center justify-between py-4">
														<dt className="text-gray-600">Tax</dt>
														<dd className="font-medium text-gray-900">
															$53.40
														</dd>
													</div>
													<div className="flex items-center justify-between py-4">
														<dt className="text-base font-medium text-gray-900">
															Order total
														</dt>
														<dd className="text-base font-medium text-gray-900">
															$320.40
														</dd>
													</div>
												</dl>
											</div>
										</div>
									</section>

									<div className="mt-8 flex justify-end px-4 sm:px-6 lg:px-8">
										<button
											type="submit"
											className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
										>
											Continue to Payment
										</button>
									</div>
								</form>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
