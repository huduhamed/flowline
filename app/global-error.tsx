'use client';

function GlobalError({ reset }: { error: Error; reset: () => void }) {
	return (
		<html>
			<body>
				<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
					<div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
						<div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 mb-4 mx-auto">
							<svg
								className="w-6 h-6 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h1 className="text-xl font-semibold text-center text-gray-900 mb-2">
							Application Error
						</h1>
						<p className="text-sm text-gray-600 text-center mb-4">
							The application encountered an unexpected error. Please try again.
						</p>
						<div className="flex gap-2">
							<button
								onClick={() => reset()}
								className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600"
							>
								Try Again
							</button>
							<button
								onClick={() => (window.location.href = '/')}
								className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300"
							>
								Home
							</button>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}

export default GlobalError;
