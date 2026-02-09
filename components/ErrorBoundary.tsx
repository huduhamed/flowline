'use client';

import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: (error: Error) => ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('Error caught by boundary:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback(this.state.error || new Error('Unknown error'));
			}

			return (
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
							Something went wrong
						</h1>
						<p className="text-sm text-gray-600 text-center mb-4">
							{this.state.error?.message || 'An unexpected error occurred'}
						</p>
						<button
							onClick={() => window.location.reload()}
							className="w-full px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600"
						>
							Reload Page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
