"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
	search: string;
	onSearch: (search: string) => void;
}

export default function SearchBox({ search, onSearch }: Props) {
	const [searchValue, setSearchValue] = useState(search);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSearch(searchValue);
			}}
		>
			<input
				type="text"
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				className="border border-gray-300 rounded-md p-2 mr-4 dark:bg-gray-800 dark:text-gray-100"
			/>
			<button
				type="submit"
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
			>
				Search
			</button>
		</form>
	);
}
