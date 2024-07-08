import { SearchParams } from "typesense/lib/Typesense/Documents";

export type FilterValue = string | string[];

interface ExactFilter {
	/**
	 * @example foo:=bar
	 */
	Exact(value: FilterValue): string;
}

interface PartialFilter {
	/**
	 * @example foo:bar
	 */
	Partial(value: FilterValue): string;
}

interface NegateFilter {
	/**
	 * @example foo:!=bar
	 */
	Negate(value: FilterValue): string;
}

// TODO: Implement OR filter.

/**
 * @note FROM DOCS.
 *  You can enable "range_index": true on the numerical field schema for fast range queries
 *  (this will incur additional memory overhead though).
 */
interface NumericalFilter {
	/**
	 * @example foo:[1..10]
	 */
	Range(value: [number, number]): string;

	/**
	 * @example foo:>10
	 */
	Gt(value: number): string;

	/**
	 * @example foo:>=10
	 */
	Gte(value: number): string;

	/**
	 * @example foo:<10
	 */
	Lt(value: number): string;

	/**
	 * @example foo:<=10
	 */
	Lte(value: number): string;

	/**
	 * @example foo:=10
	 */
	Eq(value: number): string;

	// TODO: Implement this "[10..100,40]"" (Filter docs where value is between 10 to 100 or exactly 40).
}

type FluentFilter = ExactFilter &
	PartialFilter &
	NegateFilter &
	NumericalFilter;

interface FluentContext extends FluentFilter {}

function FluentContextImpl(field: string): FluentContext {
	return {
		Exact: (value) => `${field}:=${toString(value)}`,
		Partial: (value) => `${field}:${toString(value)}`,
		Negate: (value) => `${field}:!=${toString(value)}`,
		Range: ([left, right]) => `${field}:[${left}..${right}]`,
		Gt: (value) => `${field}:>${value}`,
		Gte: (value) => `${field}:>=${value}`,
		Lt: (value) => `${field}:<${value}`,
		Lte: (value) => `${field}:<=${value}`,
		Eq: (value) => `${field}:=${value}`,
	};
}

interface FluentFunction {
	(ctx: FluentContext): string;
}

const quote = (v: string) => `\`${v}\``;

const toString = (value: FilterValue) => {
	if (Array.isArray(value)) {
		return `[${value.map((v) => quote(v)).join(",")}]`;
	}

	return quote(value);
};

/**
 * @example
 *   const builder = new TypesenseSearchBuilder({
 *       facet_by: "tags,timeEstimate",
 *       per_page: 12,
 *       exhaustive_search: true,
 *   });
 *
 *   const query = builder
 *       .q("*")
 *       .queryBy("name,description")
 *       .filterBy("tags", (ctx) => ctx.Exact("soup"))
 *       .filterBy("tags", (ctx) => ctx.Exact("vegetarian"))
 *       .filterBy("timeEstimate", (ctx) => ctx.Range([10, 30]))
 *       .build();
 *
 */
export class TypesenseSearchBuilder {
	#data: SearchParams = {};
	#filters: string[] = [];

	constructor(init?: SearchParams) {
		if (init) this.#data = { ...init };
	}

	// TODO: Make this a setter.
	//       Type 'K' cannot be used to index type 'SearchParams'.ts(2536)
	//       Type 'string' is not assignable to type 'undefined'
	private csvHelper<K extends keyof SearchParams>(
		key: K,
		value: string
	): string {
		if (this.#data[key]) {
			return this.#data[key] + `,${value}`;
		} else {
			return value;
		}
	}

	set<K extends keyof SearchParams>(key: K, value: SearchParams[K]) {
		this.#data[key] = value;

		return this;
	}

	q(q: string) {
		this.#data.q = q;

		return this;
	}

	sortBy(field: string, direction: SortOrder) {
		const expr = `${field}:${direction}`;

		this.#data["sort_by"] = this.csvHelper("sort_by", expr);

		return this;
	}

	queryBy(...fields: string[]) {
		for (const field of fields) {
			this.#data["query_by"] = this.csvHelper("query_by", field);
		}

		return this;
	}

	filterBy(field: string, action: FluentFunction) {
		const ctx = FluentContextImpl(field);
		const expression = action(ctx);

		this.#filters.push(expression);

		return this;
	}

	build(): SearchParams {
		if (this.#filters.length > 0) {
			this.#data.filter_by = this.#filters.join(" && ");
		}

		return this.#data;
	}
}
